import asyncio

from cancel_token import CancellationToken

from backend.workers.common.worker.ServiceWorker import ServiceWorker
from backend.workers.svc.app.RevoicerService import RevoicerService

revoicer = ServiceWorker(RevoicerService())
asyncio.run(revoicer.run(CancellationToken()))
