import os

from backend.workers.common.azure.BlobStorageService import BlobStorageService
from backend.workers.common.azure.ServiceBusService import ServiceBusService
from backend.workers.common.cloud.CloudProvider import CloudProvider
from backend.workers.common.cloud.CloudQueueService import CloudQueueService
from backend.workers.common.cloud.CloudStorageService import CloudStorageService

CONTAINER_NAME = os.environ["CONTAINER_NAME"]

AZURE_SB_ENDPOINT = os.environ["AZURE_SB_ENDPOINT"]
AZURE_SB_ACCESS_KEY_NAME = os.environ["AZURE_SB_ACCESS_KEY_NAME"]
AZURE_SB_ACCESS_KEY_VALUE = os.environ["AZURE_SB_ACCESS_KEY_VALUE"]

AZURE_ACCOUNT_NAME = os.environ["AZURE_ACCOUNT_NAME"]
AZURE_STORAGE_ACCESS_KEY = os.environ["AZURE_STORAGE_ACCESS_KEY"]

# Settings
QUEUE_CONNECTION_STRING = f"Endpoint={AZURE_SB_ENDPOINT};" \
                          f"SharedAccessKeyName={AZURE_SB_ACCESS_KEY_NAME};" \
                          f"SharedAccessKey={AZURE_SB_ACCESS_KEY_NAME};" \
                          f"AccountName={AZURE_ACCOUNT_NAME}"

STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;" \
                            f"AccountName={AZURE_ACCOUNT_NAME};" \
                            f"AccountKey={AZURE_STORAGE_ACCESS_KEY};" \
                            "EndpointSuffix=core.windows.net"
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
