import asyncio
import os
from typing import List

from workers.common.exceptions.RevoicerException import RevoicerException
from workers.common.model.FileInfo import FileInfo
from workers.common.model.RevoicerJob import RevoicerJob
from workers.common.services.RevoicerBaseService import RevoicerBaseService

TJob = RevoicerJob
TWorkItem = FileInfo | str

INPUT_QUEUE_NAME = os.environ["INPUT_QUEUE_NAME"]
OUTPUT_QUEUE_NAME = os.environ["OUTPUT_QUEUE_NAME"]
DEMUCS_MODEL = os.environ["DEMUCS_MODEL"]
DEMUCS_SHIFTS = os.environ["DEMUCS_SHIFTS"]


class SplitService(RevoicerBaseService):
    def __init__(self):
        super().__init__(RevoicerJob, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)
        self.model = DEMUCS_MODEL
        self.shifts = DEMUCS_SHIFTS

    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        return job.Split

    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        return [self.preprocess_input_work_item(file) for file in job.Input]

    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        job.Split = [str(file.RemotePath) for file in output_items]
        print(f"Job is ready to be sent. Processed files: {str(job.Split)}")
        return job

    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
        result = []

        output_path_format = job.OperationId + "/{stem}.{ext}"
        process = await asyncio.create_subprocess_exec(
            "demucs",
            "-d=cuda",
            f"--name={self.model}",
            "--jobs=12",
            f"--shifts={self.shifts}",
            '--filename',
            output_path_format,
            work_item.LocalPath,
        )
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
