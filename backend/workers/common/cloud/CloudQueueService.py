from abc import ABCMeta, abstractmethod
from typing import TypeVar, Generic, Iterator, AsyncIterator

from cancel_token import CancellationToken

from backend.workers.common.cloud.QueueMessage import QueueMessage

T = TypeVar("T")
TMessage = TypeVar("TMessage")


class CloudQueueService(Generic[T, TMessage], metaclass=ABCMeta):

    @abstractmethod
    async def send_message(self, queue_name: str, message: QueueMessage[T, TMessage]) -> QueueMessage[T, TMessage]:
        pass

    @abstractmethod
    def wait_for_message(self, queue_name: str, object_type: type[T], cancellation_token: CancellationToken
                         ) -> AsyncIterator[QueueMessage[T, TMessage]]:
        pass

    @abstractmethod
    def complete(self, queue_name: str, message: QueueMessage[T, TMessage]):
        pass
