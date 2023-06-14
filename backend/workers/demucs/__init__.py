import asyncio

from cancel_token import CancellationToken

from backend.workers.common.worker.ServiceWorker import ServiceWorker
from backend.workers.demucs.app.DemucsWorker import DemucsWorker
from backend.workers.demucs.app.SplitService import SplitService

# Settings
QUEUE_CONNECTION_STRING = "Endpoint=sb://revoicer.servicebus.windows.net/;" \
                          "SharedAccessKeyName=RootManageSharedAccessKey;" \
                          "SharedAccessKey=r62Vegf/HS2iKV6MJHaDprhNC6KSe/7jH+ASbAH7Sbc=;" \
                          "AccountName=revoicer"

STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;" \
                            "AccountName=revoicer;" \
                            "AccountKey=0V+Dn/QnQ7tRSwaevHymXGtR/UgstoMITdhotUxGRtPDc5/wz+wj7QmQpHqWxP+N7eUI5LzHlwIp+AStdfhaKg==;" \
                            "EndpointSuffix=core.windows.net"

INPUT_QUEUE_NAME = 'revoicer-demucs-input.fifo'
OUTPUT_QUEUE_NAME = 'revoicer-demucs-output.fifo'

split = ServiceWorker(SplitService())
asyncio.run(split.run(CancellationToken()))
