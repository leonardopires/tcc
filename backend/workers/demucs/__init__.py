import asyncio
import os

from cancel_token import CancellationToken

from backend.workers.common.worker.ServiceWorker import ServiceWorker
from backend.workers.demucs.app.SplitService import SplitService

split = ServiceWorker(SplitService())
asyncio.run(split.run(CancellationToken()))
