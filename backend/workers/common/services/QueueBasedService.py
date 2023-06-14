import abc
import asyncio
from abc import abstractmethod
from typing import TypeVar, Generic, AsyncIterator, List, Any

from azure.servicebus import ServiceBusMessage
from cancel_token import CancellationToken

from backend.workers.common.cloud.CloudProvider import CloudProvider
from backend.workers.common.cloud.CloudProviderFactory import CloudProviderFactory
from backend.workers.common.cloud.QueueMessage import QueueMessage

TJob = TypeVar("TJob")
TWorkItem = TypeVar("TWorkItem")


class QueueBasedService(Generic[TJob, TWorkItem], metaclass=abc.ABCMeta):

    def __init__(self, object_type: type[TJob], input_queue: str, output_queue: str):
        self.object_type = object_type
        self.factory = CloudProviderFactory(cloud_provider=CloudProvider.Azure)
        self.queue_service = self.factory.get_queue_service()
        self.storage_service = self.factory.get_storage_service()
        self.input_queue = input_queue
        self.output_queue = output_queue

    async def wait_for_input(self, token: CancellationToken = CancellationToken()
                             ) -> AsyncIterator[QueueMessage[TJob, ServiceBusMessage]]:
        async for message in self.queue_service.wait_for_message(self.input_queue, self.object_type, token):
            if message.body is not None:
                yield message

    async def submit_output(self, job: TJob) -> TJob:
        return await self.queue_service.send_message(self.output_queue, job)

    async def load_work_items(self, job: TJob) -> List[TWorkItem]:
        work_items = self.get_input_work_items(job)
        result = []

        for item in work_items:
            downloaded_file = await self.load_work_item(item)
            result.append(downloaded_file)
        pass

        return result

    async def process_job(self, job: TJob) -> TJob:
        work_items = await self.load_work_items(job)
        output_items = []
        tasks = []
        for work_item in work_items:
            result = await self.process_work_item(job, work_item)
            output_items = [*output_items, *result]

        output_items = await self.postprocess_output_work_items(job, output_items)

        await self.store_work_items(job, output_items)
        self.set_output_work_items(job, output_items)

        return job

    async def publish_results(self, job: TJob, input_message: QueueMessage[TJob, ServiceBusMessage]) -> TJob:
        output_message = QueueMessage(job, None)
        output_message.body = job

        await self.queue_service.send_message(self.output_queue, output_message)
        await self.queue_service.complete(self.input_queue, input_message)

        return job

    async def store_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        tasks = []

        for item in output_items:
            tasks.append(self.store_work_item(item))

        await asyncio.gather(*tasks)

        return job

    @abstractmethod
    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        pass

    @abstractmethod
    async def load_work_item(self, work_item: TWorkItem) -> TWorkItem:
        pass

    @abstractmethod
    async def store_work_item(self, work_item: TWorkItem):
        return await self.storage_service.put_file(work_item)

    @abstractmethod
    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
        pass

    @abstractmethod
    def preprocess_output_work_item(self, job: TJob, file: Any) -> TWorkItem:
        pass

    @abstractmethod
    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        pass

    @abstractmethod
    async def postprocess_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> List[TWorkItem]:
        pass

    @abstractmethod
    def get_output_format(self, job: TJob) -> str:
        pass

    @abstractmethod
    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        pass
