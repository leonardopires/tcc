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
        """
        The __init__ function is called when the class is instantiated.
        It sets up the service that will be used to process jobs.

        :param self: Represent the instance of the class
        :param service: QueueBasedService[TJob: Define the type of service
        :param TWorkItem]: Specify the type of work item that will be used by the service
        :return: An instance of the class
        """
        self.service = service

    async def run(self, token: CancellationToken):
        """
        The run function is the entry point for the service worker.
        It will wait for messages from a queue, process them and publish results to another queue.


        :param self: Access the service object
        :param token: CancellationToken: Cancel the worker when it is no longer needed
        :return: When the token is cancelled, which happens when the service stops
        """
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
