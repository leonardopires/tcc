import asyncio
import os
from typing import List

from workers.common.exceptions.RevoicerException import RevoicerException
from workers.common.model.FileInfo import FileInfo
from workers.common.model.RevoicerJob import RevoicerJob
from workers.common.services.RevoicerBaseService import RevoicerBaseService

TJob = RevoicerJob
TWorkItem = FileInfo | str

INPUT_QUEUE_NAME = os.environ["REVOICER_INPUT_QUEUE_NAME"]
OUTPUT_QUEUE_NAME = os.environ["REVOICER_OUTPUT_QUEUE_NAME"]
DEMUCS_MODEL = "htdemucs"
DEMUCS_SHIFTS = os.environ["REVOICER_DEMUCS_SHIFTS"]


class SplitService(RevoicerBaseService):
    def __init__(self):
        super().__init__(RevoicerJob, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)
        self.model = DEMUCS_MODEL
        self.shifts = DEMUCS_SHIFTS

    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        """    
        The get_output_work_items function is used to determine the output work items of a job.
        
        :param self: Access the class attributes and methods
        :param job: TJob: Get the job that is being processed
        :return: A list of work items
        """
        return job.Split

    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        """    
        The get_input_work_items function is used to create a list of work items from the input files.
        
        :param self: Bind the method to the object
        :param job: TJob: Access the input files in the job
        :return: A list of work items
        """
        return [self.preprocess_input_work_item(file) for file in job.Input]

    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        """    
        The set_output_work_items function is used to set the output work items for a job.
        
        :param self: Represent the instance of the class
        :param job: TJob: Store the job that is being processed
        :param output_items: List[TWorkItem]: Pass the list of files that were processed by the job
        :return: A job object that contains a list of the processed files
        """
        job.Split = [str(file.RemotePath) for file in output_items]
        print(f"Job is ready to be sent. Processed files: {str(job.Split)}")
        return job

    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
        """    
        The process_work_item function is the core of your Revoicer plugin.
        It receives a work item, which contains information about the file to be processed, and returns a list of new work items.
        The new work items will be added to the job's queue for processing by other plugins in your pipeline.
        
        
        :param self: Access the attributes of the class
        :param job: TJob: Identify the job that is being processed
        :param work_item: TWorkItem: Receive the input file
        :return: A list of tworkitem
        """
        result = []

        output_path_format = job.OperationId + "/{stem}.{ext}"
        args = [
            "demucs",
            "-d=cuda",
            f"--name={self.model}",
            "--jobs=12",
            f"--shifts={self.shifts}",
            '--filename',
            output_path_format,
            work_item.LocalPath,
        ]

        print(f"Running demucs with args: {args}")
        process = await asyncio.create_subprocess_exec(*args)
        return_code = await process.wait()

        if return_code != 0:
            raise RevoicerException(f"Ocorreu um erro executando o DEMUCS. Código: {return_code}")

        output_dir = f"/data/separated/{self.model}/{job.OperationId}"

        result = [
            *result,
            *[
                self.preprocess_output_work_item(job, os.path.join(output_dir, file))
                for file in os.listdir(output_dir)
            ],
        ]

        return result
