import asyncio

from cancel_token import CancellationToken

from workers.common.worker.ServiceWorker import ServiceWorker
from workers.svc.app.RevoicerService import RevoicerService

revoicer = ServiceWorker(RevoicerService())
asyncio.run(revoicer.run(CancellationToken()))
