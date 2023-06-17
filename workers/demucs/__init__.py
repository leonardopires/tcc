import asyncio

from cancel_token import CancellationToken

from workers.common.worker.ServiceWorker import ServiceWorker
from workers.demucs.app.SplitService import SplitService

split = ServiceWorker(SplitService())
asyncio.run(split.run(CancellationToken()))
