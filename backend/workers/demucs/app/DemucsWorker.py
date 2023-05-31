import os

from backend.workers.common.WorkerBase import WorkerBase


class DemucsWorker(WorkerBase):

    def get_local_path(self, file_info):
        return "/" + file_info["FilePath"]

    def get_remote_path(self, file_info):
        return file_info["FilePath"]

    def create_output_message(self, input_message, results):
        return {
            "JobId": input_message["JobId"],
            "Name": input_message["Name"],
            "FilePath": input_message["FilePath"],
            "Voice": input_message["Voice"],
            "SeparatedFiles": results,
        }

    def get_output_dir(self, file):
        return "/data/separated/htdemucs"

    def __init__(self, endpoint_url, aws_region, input_queue_name, output_queue_name):
        super().__init__(endpoint_url, aws_region, input_queue_name, output_queue_name)

    def get_command_params(self, file, message):
        return [
            "demucs",
            "-d=cuda",
            "-n=htdemucs",
            "--two-stems=vocals",
            "-j=12",
            "-v",
            file
        ]
