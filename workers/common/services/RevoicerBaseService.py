import asyncio
import os
from abc import ABCMeta
from typing import List, Any

from workers.common.exceptions.RevoicerException import RevoicerException
from workers.common.model.FileInfo import FileInfo
from workers.common.model.RevoicerJob import RevoicerJob
from workers.common.services.QueueBasedService import QueueBasedService

TJob = RevoicerJob
TWorkItem = FileInfo


class RevoicerBaseService(QueueBasedService[TJob, TWorkItem], metaclass=ABCMeta):
    async def load_work_item(self, work_item: TWorkItem) -> TWorkItem:
        return await self.storage_service.get_file(work_item)

    async def store_work_item(self, work_item: TWorkItem):
        return await self.storage_service.put_file(work_item)


    def preprocess_input_work_item(self, file: Any) -> FileInfo:
        # noinspection PyArgumentList
        file_info = FileInfo(str(file), "/" + str(file))
        return file_info

    def preprocess_output_work_item(self, job: TJob, file: Any) -> TWorkItem:
        file_name = os.path.basename(file)
        # noinspection PyArgumentList
        result = FileInfo(f"data/{job.OperationId}/output/{file_name}", file)
        return result

    async def postprocess_output_work_items(self, job: TJob, output_items: List[TWorkItem]) -> List[TWorkItem]:
        result = []
        tasks = []

        output_format = self.get_output_format(job)

        for original_item in output_items:
            local_filename, extension = os.path.splitext(original_item.LocalPath)
            remote_filename, _ = os.path.splitext(original_item.RemotePath)

            if extension != ".wav":
                continue

            # noinspection PyArgumentList
            converted_item = TWorkItem(
                RemotePath=f"{remote_filename}.{output_format}",
                LocalPath=f"{local_filename}.{output_format}"
            )

            args = ["ffmpeg", "-y", "-i", original_item.LocalPath, "-c:a", output_format, converted_item.LocalPath]
            print(f"Executing FFMPEG with the following arguments: {str(args)}")
            process = await asyncio.create_subprocess_exec(*args)

            result.append(original_item)
            result.append(converted_item)
            tasks.append(process.wait())

        gather_result = await asyncio.gather(*tasks)

        result_code = sum(item for item in gather_result)

        if result_code != 0:
            raise RevoicerException(f"Um ou mais arquivos falharam ao serem convertidos para {output_format}")

        return result

    def get_output_format(self, job: TJob) -> str:
        match job.ContentType:
            case "audio/mpeg":
                return "mp3"
            case "audio/mpeg4":
                return "aac"
            case "audio/aac":
                return "aac"
            case _:
                return "mp3"
