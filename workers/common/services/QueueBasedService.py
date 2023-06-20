import abc
import asyncio
from abc import abstractmethod
from typing import TypeVar, Generic, AsyncIterator, List, Any

from azure.servicebus import ServiceBusMessage
from cancel_token import CancellationToken

from workers.common.cloud.CloudProvider import CloudProvider
from workers.common.cloud.CloudProviderFactory import CloudProviderFactory
from workers.common.cloud.QueueMessage import QueueMessage

TJob = TypeVar("TJob")
TWorkItem = TypeVar("TWorkItem")


class QueueBasedService(Generic[TJob, TWorkItem], metaclass=abc.ABCMeta):

    def __init__(self, object_type: type[TJob], input_queue: str, output_queue: str):
        """
        The __init__ function is called when the class is instantiated.
        It sets up the object with all of its properties and methods.
        The __init__ function takes in a parameter for each attribute to be assigned,
        and assigns it using self.&lt;attribute&gt; = &lt;parameter&gt;.  The self variable refers to the instance of the object itself.

        :param self: Represent the instance of the class
        :param object_type: type[TJob]: Create a new instance of the object type that is passed in
        :param input_queue: str: Specify the name of the input queue
        :param output_queue: str: Specify the name of the queue that will be used to store results
        :return: Nothing, but it is called to initialize the object
        """
        self.object_type = object_type
        self.factory = CloudProviderFactory(cloud_provider=CloudProvider.Azure)
        self.queue_service = self.factory.get_queue_service()
        self.storage_service = self.factory.get_storage_service()
        self.input_queue = input_queue
        self.output_queue = output_queue

    async def wait_for_input(self, token: CancellationToken = CancellationToken()
                             ) -> AsyncIterator[QueueMessage[TJob, ServiceBusMessage]]:
        """
        The wait_for_input function is a generator that yields messages from the input queue.
        It will continue to yield messages until it receives a cancellation token, at which point it will stop yielding and return.


        :param self: Refer to the object itself
        :param token: CancellationToken: Cancel the wait_for_input function
        :return: An asynciterator of queuemessage[tjob, servicebusmessage]
        """
        async for message in self.queue_service.wait_for_message(self.input_queue, self.object_type, token):
            if message.body is not None:
                yield message

    async def submit_output(self, job: TJob) -> TJob:
        """
        The submit_output function is used to submit the output of a job to the output queue.

        :param self: Refer to the current instance of the class
        :param job: TJob: Pass the job object to the submit_output function
        :return: A tjob object
        """
        return await self.queue_service.send_message(self.output_queue, job)

    async def load_work_items(self, job: TJob) -> List[TWorkItem]:
        """
        The load_work_items function is responsible for downloading the work items from the input source.

        :param self: Represent the instance of the class
        :param job: TJob: Pass the job object to the function
        :return: A list of work items
        """
        work_items = self.get_input_work_items(job)
        result = []

        for item in work_items:
            downloaded_file = await self.load_work_item(item)
            result.append(downloaded_file)
        pass

        return result

    async def process_job(self, job: TJob) -> TJob:
        """
        The process_job function is the main entry point for a job.
        It will be called by the JobManager when it's time to process a job.
        The function should return an updated version of the input job, which may include new work items and/or output files.


        :param self: Refer to the current instance of a class
        :param job: TJob: Pass the job object to the function
        :return: A job object
        """
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
        """
        The publish_results function is responsible for publishing the results of a job to the output queue.

        :param self: Refer to the object itself
        :param job: TJob: Pass the job object to the function
        :param input_message: QueueMessage[TJob: Get the message body
        :param ServiceBusMessage]: Pass the message from the input queue to the output queue
        :return: The job object
        """
        output_message = QueueMessage(job, None, None)
        output_message.body = job

        await self.queue_service.send_message(self.output_queue, output_message)
        await self.queue_service.complete(self.input_queue, input_message)

        return job

    async def store_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        """
        The store_work_items function is responsible for storing the output of a job.

        :param self: Access the class attributes and methods
        :param job: TJob: Pass the job object to the function
        :param output_items: List[TWorkItem]: Store the output items of a job
        :return: The job object
        """
        tasks = []

        for item in output_items:
            tasks.append(self.store_work_item(item))

        await asyncio.gather(*tasks)

        return job

    @abstractmethod
    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        """
        The get_input_work_items function is used to determine which work items are required for a given job.

        :param self: Represent the instance of the class
        :param job: TJob: Pass the job object to the function
        :return: A list of work items
        """
        pass

    @abstractmethod
    async def load_work_item(self, work_item: TWorkItem) -> TWorkItem:
        """
        The load_work_item function is used to load a work item from the cloud storage.

        :param self: Represent the instance of the class
        :param work_item: TWorkItem: Pass in the work item to be loaded
        :return: A tworkitem object
        """
        pass

    @abstractmethod
    async def store_work_item(self, work_item: TWorkItem):
        """
        The store_work_item function is used to store a work item in the storage service.

        :param self: Represent the instance of the class
        :param work_item: TWorkItem: Store the work item in the storage service
        :return: A file path
        """
        return await self.storage_service.put_file(work_item)

    @abstractmethod
    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
        """
        The process_work_item function is the one that actually performs the work for each work item in the job.

        :param self: Access the class instance
        :param job: TJob: Pass in the job object
        :param work_item: TWorkItem: Pass the work item to be processed
        :return: A list of work items
        """
        pass

    @abstractmethod
    def preprocess_output_work_item(self, job: TJob, file: Any) -> TWorkItem:
        """
        The preprocess_output_work_item function is called after the job has been run, and its output files have been
        downloaded. It can be used to modify the output files before they are uploaded to their final destination.
        The function should return a list of work items that will be executed in order.

        :param self: Represent the instance of the class
        :param job: TJob: Pass the job object to the function
        :param file: Any: Pass the file object to the function
        :return: A work item
        """
        pass

    @abstractmethod
    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        """
        The set_output_work_items function is used to set the output work items for a job.

        :param self: Represent the instance of the class
        :param job: TJob: Identify the job that is being worked on
        :param output_items: List[TWorkItem]: Set the output work items of a job
        :return: A job
        """
        pass

    @abstractmethod
    async def postprocess_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> List[TWorkItem]:
        """
        The postprocess_output_work_items function is called after the output work items have been generated.
        It can be used to modify the output work items, or add additional ones.
        The function should return a list of TWorkItem objects.

        :param self: Refer to the class itself
        :param job: TJob: Access the job's configuration
        :param output_items: List[TWorkItem]: Pass the list of work items that have been created by the job
        :return: A list of work items
        """
        pass

    @abstractmethod
    def get_output_format(self, job: TJob) -> str:
        """
        The get_output_format function is used to determine the output format that the files related to
        a job will be stored on the storage service.

        :param self: Represent the instance of the class
        :param job: TJob: Access the job's data, which is a dictionary
        :return: The format of the output file
        """
        pass

    @abstractmethod
    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        """
        The get_output_work_items function is used to determine the output work items for a given job.

        :param self: Refer to the instance of the class
        :param job: TJob: Pass the job to be processed
        :return: A list of work items
        """
        pass
