from abc import ABCMeta, abstractmethod
from typing import TypeVar, Generic, AsyncIterator

from cancel_token import CancellationToken

from workers.common.cloud.QueueMessage import QueueMessage

T = TypeVar("T")
TMessage = TypeVar("TMessage")


class CloudQueueService(Generic[T, TMessage], metaclass=ABCMeta):

    @abstractmethod
    async def send_message(self, queue_name: str, message: QueueMessage[T, TMessage]) -> QueueMessage[T, TMessage]:
        """
        The send_message function is used to send a message to the queue.

        :param self: Represent the instance of the class
        :param queue_name: str: Specify the name of the queue you want to send a message to
        :param message: QueueMessage[T: Specify the type of message that is being sent
        :param TMessage]: Specify the type of message that is being sent
        :return: A queuemessage object
        """
        pass

    @abstractmethod
    def wait_for_message(self, queue_name: str, object_type: type[T], cancellation_token: CancellationToken
                         ) -> AsyncIterator[QueueMessage[T, TMessage]]:
        """
        The wait_for_message function is a coroutine that waits for messages to arrive on the queue.
        It returns an async iterator of QueueMessage objects, which are wrappers around the message and its metadata.
        The object_type parameter specifies what type of object you expect to receive from the queue; this is used for deserialization purposes.

        :param self: Represent the instance of the class
        :param queue_name: str: Specify the name of the queue to listen on
        :param object_type: type[T]: Specify the type of object that you want to receive from the queue
        :param cancellation_token: CancellationToken: Cancel the operation
        :return: An async iterator
        """
        pass

    @abstractmethod
    def complete(self, queue_name: str, message: QueueMessage[T, TMessage]):
        """
        The complete function is called when a message has been successfully processed.
        This function should be used to remove the message from the queue, or mark it as completed.


        :param self: Represent the instance of the class
        :param queue_name: str: Specify the name of the queue that you want to complete a message from
        :param message: QueueMessage[T: Define the type of message that is being sent
        :param TMessage]: Specify the type of message that is being passed
        :return: A message object
        """
        pass
