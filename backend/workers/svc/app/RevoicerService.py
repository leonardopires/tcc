import asyncio
import os
from typing import List, Any

from backend.workers.common.exceptions.RevoicerException import RevoicerException
from backend.workers.common.model.FileInfo import FileInfo
from backend.workers.common.model.RevoicerJob import RevoicerJob
from backend.workers.common.services.RevoicerBaseService import RevoicerBaseService

TJob = RevoicerJob
TWorkItem = FileInfo | str

INPUT_QUEUE_NAME = os.environ["INPUT_QUEUE_NAME"]
OUTPUT_QUEUE_NAME = os.environ["OUTPUT_QUEUE_NAME"]


class RevoicerService(RevoicerBaseService):
    def __init__(self):
        super().__init__(RevoicerJob, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)

    def get_input_work_items(self, job: TJob) -> List[TWorkItem]:
        return [self.preprocess_input_work_item(file) for file in job.Split
                if file.endswith("/vocals.wav")]

    def set_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> TJob:
        job.Revoiced = [str(file.RemotePath) for file in output_items]
        return job

    def get_output_work_items(self, job: TJob) -> List[TWorkItem]:
        return job.Revoiced

    async def process_work_item(self, job: TJob, work_item: TWorkItem) -> List[TWorkItem]:
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
