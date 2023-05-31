import array
import os.path

from backend.workers.common.WorkerBase import WorkerBase


class SvcWorker(WorkerBase):
    def get_local_path(self, file_info):
        return "/data/" + file_info["SeparatedFiles"][1]

    def get_remote_path(self, file_info):
        return file_info["SeparatedFiles"][1]

    def create_output_message(self, input_message, results):
        return {
            "JobId": input_message["JobId"],
            "Name": input_message["Name"],
            "FilePath": input_message["FilePath"],
            "Voice": input_message["Voice"],
            "SeparatedFiles": input_message["SeparatedFiles"],
            "UpdatedVocals": results,
        }

    def __init__(self, endpoint_url, aws_region, input_queue_name, output_queue_name):
        super().__init__(endpoint_url, aws_region, input_queue_name, output_queue_name)

    def get_output_dir(self, file):
        return os.path.dirname(file)

    def get_command_params(self, file, message):
        voice = message["Voice"]
        input_file = file
        output_file = os.path.join(self.get_output_dir(file), f"{voice}.wav")

        return [
            "svc",
            "infer",
            f"--output-path={output_file}",
            f"--model-path=/models/{voice}",
            f"--config-path=/models/{voice}/config.json",
            "--no-auto-predict-f0",
            input_file
        ]

    def get_path_details(self, local_path, remote_path, input_message):
        output_dir = self.get_output_dir(local_path)
        file_name = os.path.dirname(local_path)
        remote_path = self.get_remote_path(input_message)
        return file_name, output_dir, remote_path

