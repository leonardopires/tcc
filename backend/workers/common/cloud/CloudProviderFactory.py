from backend.workers.common.azure.BlobStorageService import BlobStorageService
from backend.workers.common.azure.ServiceBusService import ServiceBusService
from backend.workers.common.cloud.CloudProvider import CloudProvider
from backend.workers.common.cloud.CloudQueueService import CloudQueueService
from backend.workers.common.cloud.CloudStorageService import CloudStorageService

QUEUE_CONNECTION_STRING = "Endpoint=sb://revoicer.servicebus.windows.net/;" \
                          "SharedAccessKeyName=RootManageSharedAccessKey;" \
                          "SharedAccessKey=r62Vegf/HS2iKV6MJHaDprhNC6KSe/7jH+ASbAH7Sbc=;" \
                          "AccountName=revoicer"

STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;" \
                            "AccountName=revoicer;" \
                            "AccountKey=0V+Dn/QnQ7tRSwaevHymXGtR/UgstoMITdhotUxGRtPDc5/wz+wj7QmQpHqWxP+N7eUI5LzHlwIp+AStdfhaKg==;" \
                            "EndpointSuffix=core.windows.net"

DEMUCS_INPUT_QUEUE_NAME = 'revoicer-demucs-input.fifo'
DEMUCS_OUTPUT_QUEUE_NAME = 'revoicer-demucs-output.fifo'

SVC_INPUT_QUEUE_NAME = 'revoicer-demucs-input.fifo'
SVC_OUTPUT_QUEUE_NAME = 'revoicer-demucs-output.fifo'

CONTAINER_NAME = "revoicer"


class CloudProviderFactory:
    def __init__(self, cloud_provider: CloudProvider):
        self.cloud_provider = cloud_provider

    def get_queue_service(self) -> CloudQueueService:
        match self.cloud_provider:
            case CloudProvider.Azure:
                return ServiceBusService(QUEUE_CONNECTION_STRING)
            case _:
                raise Exception("Provider not supported")

    def get_storage_service(self) -> CloudStorageService:
        match self.cloud_provider:
            case CloudProvider.Azure:
                return BlobStorageService(STORAGE_CONNECTION_STRING, CONTAINER_NAME)
            case _:
                raise Exception("Provider not supported")
