import asyncio
import os
from typing import List, Any

from backend.workers.common.exceptions.RevoicerException import RevoicerException
from backend.workers.common.model.FileInfo import FileInfo
from backend.workers.common.model.RevoicerJob import RevoicerJob
from backend.workers.common.services.RevoicerBaseService import RevoicerBaseService

TJob = RevoicerJob
TWorkItem = FileInfo | str


class SplitService(RevoicerBaseService):
    def __init__(self):
        super().__init__(RevoicerJob, "revoicer-demucs-input.fifo", "revoicer-demucs-output.fifo")
        self.model = "htdemucs_6s"
        self.shifts = 2

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
            raise RevoicerException(f"Ocorreu um erro. Código: {return_code}")

        output_dir = f"/data/separated/{self.model}/{job.OperationId}"

        result = [
            *result,
            *[
                self.preprocess_output_work_item(job, os.path.join(output_dir, file))
                for file in os.listdir(output_dir)
            ],
        ]

        return result
