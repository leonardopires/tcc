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


class RevoicerService(RevoicerBaseService):
    def __init__(self):
        """
        The __init__ function is called when the class is instantiated.
        It sets up the instance of the class, and it's where you put all your initialization code.
        The __init__ function takes at least one argument: self, which refers to the object being created.

        :param self: Represent the instance of the class
        :return: The super()
        """
        super().__init__(RevoicerJob, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)

    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        """    
        The get_input_work_items function is used to generate a list of input work items for the job.
        The function takes in a single argument, which is the job object that was passed into the run_job function.
        The return value should be a list of work items, where each item corresponds to an input file or directory that
        will be processed by this job.
        
        :param self: Bind the method to an object
        :param job: TJob: Get the list of files that need to be processed
        :return: A list of tworkitem objects
        """
        return [self.preprocess_input_work_item(file) for file in job.Split
                if file.endswith("/vocals.wav")]

    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        """    
        The set_output_work_items function is used to set the output work items for a job.
        
        :param self: Represent the instance of a class
        :param job: TJob: Pass the job object to the function
        :param output_items: List[TWorkItem]: Pass the list of output work items to the function
        :return: The job object with the revoiced files added to it
        """
        job.Revoiced = [*job.Revoiced, *[str(file.RemotePath) for file in output_items]]
        return job

    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        """    
        The get_output_work_items function is used to determine which work items are output by a job.
        
        :param self: Refer to the instance of the class
        :param job: TJob: Get the revoiced work items
        :return: A list of work items
        """
        return job.Revoiced

    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
        """    
        The process_work_item function is called for each work item in the job.
        It should return a list of work items to be added to the queue, or an empty list if no new work items are 
        created.
        The function can also raise an exception if there was a problem processing the input file.
        
        :param self: Reference the class itself
        :param job: TJob: Access the voice model path
        :param work_item: TWorkItem: Pass the work item to be processed
        :return: A list of work items
        """
        result = []

        model_path = job.Voice
        voice = os.path.basename(model_path)

        input_file = work_item.LocalPath
        output_dir = os.path.dirname(input_file)
        output_file = os.path.join(output_dir, f"{voice}.wav")
        params = [
            "svc",
            "infer",
            f"--output-path={output_file}",
            f"--model-path=/models/{model_path}",
            f"--config-path=/models/{model_path}/config.json",
            "--no-auto-predict-f0",
            input_file
        ]

        process = await asyncio.create_subprocess_exec(*params)
        return_code = await process.wait()

        if return_code != 0:
            raise RevoicerException(f"Ocorreu um erro executando o SVC. Código: {return_code}")

        result = [
            *result,
            self.preprocess_output_work_item(job, output_file)
        ]

        return result
