import json
from typing import TypeVar, AsyncIterator

import marshmallow_dataclass
from azure.servicebus import ServiceBusMessage
from azure.servicebus.aio import ServiceBusClient
from cancel_token import CancellationToken

from workers.common.cloud.CloudQueueService import CloudQueueService
from workers.common.cloud.QueueMessage import QueueMessage

T = TypeVar("T")


class ServiceBusService(CloudQueueService[T, ServiceBusMessage]):
    client: ServiceBusClient

    def __init__(self, connection_string: str) -> None:
        """
        The __init__ function is called when the class is instantiated.
        It sets up the connection to ServiceBus and stores it in a variable.

        :param self: Represent the instance of the class
        :param connection_string: str: Connect to the servicebus
        :return: None, but the __init__ function of the super class returns an object
        """
        super().__init__()

        print(f"Cnnecting to ServiceBus: {connection_string}")
        self.client = ServiceBusClient.from_connection_string(connection_string)

    async def send_message(self, queue_name: str, message: QueueMessage[T, ServiceBusMessage]) -> QueueMessage[T, ServiceBusMessage]:
        """
        The send_message function sends a message to the queue.

        :param self: Bind the method to an object
        :param queue_name: str: Specify the name of the queue to send a message to
        :param message: QueueMessage[T: Define the type of message that is being sent
        :param ServiceBusMessage]: Specify the type of message that will be sent to the queue
        :return: The message that was sent
        """

        sender = self.client.get_queue_sender(queue_name)

        json_body = json.dumps(message.body.__dict__)

        service_bus_message = ServiceBusMessage(json_body)

        print(f"Sending message: {json_body}")
        await sender.send_messages(service_bus_message)

        return message

    async def wait_for_message(
            self, queue_name: str, object_type: type[T], token: CancellationToken
    ) -> AsyncIterator[QueueMessage[T, ServiceBusMessage]]:

        """
        The wait_for_message function is a generator that yields messages from the queue.
        It will continue to yield messages until the cancellation token is cancelled.


        :param self: Reference the current object
        :param queue_name: str: Specify the name of the queue to receive messages from
        :param object_type: type[T]: Specify the type of object that is expected to be received
        :param token: CancellationToken: Cancel the while loop
        :return: An async iterator
        """
        receiver = self.client.get_queue_receiver(queue_name)
        schema = marshmallow_dataclass.class_schema(object_type)()

        while not token.cancelled:
            for message in await receiver.receive_messages(max_message_count=1):
                print(f"Message received: {str(message)}")

                body = schema.loads(json_data=str(message))
                queue_message = QueueMessage(body, message)

                yield queue_message

    async def complete(self, queue_name: str, message: QueueMessage[T, ServiceBusMessage]):
        """
        The complete function is called when a message has been successfully processed.
        It can be used to delete the message from the queue, or to complete it in some other way.
        The default implementation does nothing.

        :param self: Access the properties and methods of the class
        :param queue_name: str: Identify the queue that the message is being completed from
        :param message: QueueMessage[T: Pass the message to the complete function
        :param ServiceBusMessage]: Specify the type of message that is being received
        :return: A boolean value
        """

        receiver = self.client.get_queue_receiver(queue_name)
        await receiver.complete_message(message.native_message)

