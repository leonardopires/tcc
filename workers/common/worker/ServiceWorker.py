import os
import traceback

from cancel_token import CancellationToken

from workers.common.model.FileInfo import FileInfo
from workers.common.model.RevoicerJob import RevoicerJob
from workers.common.services.QueueBasedService import QueueBasedService

TJob = RevoicerJob
TWorkItem = FileInfo


class ServiceWorker:
    service: QueueBasedService[TJob, TWorkItem]

    def __init__(self, service: QueueBasedService[TJob, TWorkItem]):
        self.service = service

    async def run(self, token: CancellationToken):
        print("Starting service worker...")

        service = self.service

        print(f"Waiting for messages from queue {service.input_queue}...")

        os.chdir("/data/")

        async for message in service.wait_for_input(token):
            try:
                job = message.body
                print(f"Job received: {str(job.JobId)}")

                job_result = await service.process_job(job)

                print(f"Job {str(job.JobId)} completed. Publishing job_result...")
                await service.publish_results(job_result, message)
                print(f"Done")

            except Exception as error:
                traceback.print_exc()
                continue
