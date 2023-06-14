import array
import os.path
import subprocess

from backend.workers.common.WorkerBase import WorkerBase


class SvcWorker(WorkerBase):
    def __init__(self, queue_endpoint_url, storage_endpoint_url, input_queue_name, output_queue_name):
        super().__init__(queue_endpoint_url, storage_endpoint_url, input_queue_name, output_queue_name)

    def get_local_path(self, file_info):
        return "/data/" + ([str(name) for name in file_info["Split"]
                if str(name).endswith("/vocals.wav")][0])

    def get_remote_path(self, file_info):
        return [str(name) for name in file_info["Split"]
                if str(name).endswith("/vocals.wav")][0]

    def create_output_message(self, input_message, results):
        voice = os.path.basename(input_message["Voice"])
        return {
            **input_message,
            "Revoiced": [str(name) for name in results
                         if str(name).endswith(f'{voice}.wav')
                         or str(name).endswith(f'{voice}.{self.output_format}')
                         or str(name) in input_message["Revoiced"]
                        ],
        }

    def get_output_dir(self, file):
        return os.path.join(os.path.dirname(file))

    def get_command_params(self, file, message):
        model_path = message["Voice"];
        voice = os.path.basename(model_path)
        input_file = file
        output_file = os.path.join(self.get_output_dir(file), f"{voice}.wav")

        config_exists=os.path.exists(f"/models/{model_path}/config.json")

        params = [
            "svc",
            "infer",
            f"--output-path={output_file}",
            f"--model-path=/models/{model_path}",
            f"--config-path=/models/{model_path}/config.json" if config_exists else "",
            "--no-auto-predict-f0",
            input_file
        ]
        return [str(param) for param in params if str(param) != ""]

    def get_path_details(self, local_path, remote_path, input_message):
        output_dir = self.get_output_dir(local_path)
        file_name = os.path.basename(local_path)
        remote_path = self.get_remote_path(input_message)
        return file_name, output_dir, remote_path

    def get_blob_path(self, file, input_message):
        return f"{input_message['OperationId']}/{file}"

