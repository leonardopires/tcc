import asyncio

from cancel_token import CancellationToken

from backend.workers.common.worker.ServiceWorker import ServiceWorker
from backend.workers.svc.app.RevoicerService import RevoicerService
from backend.workers.svc.app.SvcWorker import SvcWorker

# Settings
QUEUE_CONNECTION_STRING = "Endpoint=sb://revoicer.servicebus.windows.net/;" \
               "SharedAccessKeyName=RootManageSharedAccessKey;" \
               "SharedAccessKey=r62Vegf/HS2iKV6MJHaDprhNC6KSe/7jH+ASbAH7Sbc=;" \
               "AccountName=revoicer"

STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;" \
                            "AccountName=revoicer;" \
                            "AccountKey=0V+Dn/QnQ7tRSwaevHymXGtR/UgstoMITdhotUxGRtPDc5/wz+wj7QmQpHqWxP+N7eUI5LzHlwIp+AStdfhaKg==;" \
                            "EndpointSuffix=core.windows.net"

INPUT_QUEUE_NAME = 'revoicer-svc-input.fifo'
OUTPUT_QUEUE_NAME = 'revoicer-svc-output.fifo'


revoicer = ServiceWorker(RevoicerService())
asyncio.run(revoicer.run(CancellationToken()))
