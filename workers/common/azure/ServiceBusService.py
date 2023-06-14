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
        super().__init__()

        self.client = ServiceBusClient.from_connection_string(connection_string)

    async def send_message(self, queue_name: str, message: QueueMessage[T, ServiceBusMessage]
                           ) -> QueueMessage[T, ServiceBusMessage]:

        sender = self.client.get_queue_sender(queue_name)

        json_body = json.dumps(message.body.__dict__)

        service_bus_message = ServiceBusMessage(json_body)

        print(f"Sending message: {json_body}")
        await sender.send_messages(service_bus_message)

        return message

    async def wait_for_message(
            self, queue_name: str, object_type: type[T], token: CancellationToken
    ) -> AsyncIterator[QueueMessage[T, ServiceBusMessage]]:

        receiver = self.client.get_queue_receiver(queue_name)
        schema = marshmallow_dataclass.class_schema(object_type)()

        while not token.cancelled:
            for message in await receiver.receive_messages(max_message_count=1):
                print(f"Message received: {str(message)}")

                body = schema.loads(json_data=str(message))
                queue_message = QueueMessage(body, message)

                yield queue_message
                await receiver.complete_message(message)

    async def complete(self, queue_name: str, message: QueueMessage[T, ServiceBusMessage]):
        pass
