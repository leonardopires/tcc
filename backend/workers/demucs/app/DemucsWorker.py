import os

from backend.workers.common.WorkerBase import WorkerBase


class DemucsWorker(WorkerBase):
    def model(self):
        return "htdemucs_6s"

    def shifts(self):
        return 2

    def get_local_path(self, file_info):
        return "/" + file_info["FilePath"]

    def get_remote_path(self, file_info):
        return file_info["FilePath"]

    def create_output_message(self, input_message, results):
        return {
            **input_message,
            "Split": results,
        }

    def get_output_dir(self, file):
        return f"/data/separated/{self.model()}"

    def __init__(self, endpoint_url, aws_region, input_queue_name, output_queue_name):
        super().__init__(endpoint_url, aws_region, input_queue_name, output_queue_name)

    def get_command_params(self, file, message):
        operation_id = message['OperationId']
        output_file = operation_id + '/{stem}.{ext}'
        model = self.model()
        shifts = self.shifts()
        return [
            "demucs",
            "-d=cuda",
            f"--name={model}",
            "--jobs=12",
            f"--shifts={shifts}",
            '--filename',
            output_file,
            file,
        ]

    def get_path_details(self, local_path, remote_path, input_message):
        index = local_path.rfind("/") + 1

        if index > 0:
            output_dir = self.get_output_dir(local_path)
            file_name = local_path[index::]
            folder_name = input_message["OperationId"]
            output_path = os.path.join(output_dir, folder_name)
            print(f"Input File Name: {file_name}")
            print(f"Path: {local_path}")
            print(f"Output Path: {output_path}")
            dir_contents = os.listdir(output_dir)
            print(dir_contents)

            return folder_name, output_path, remote_path

        return None, None, remote_path

    def get_s3_path(self, file, input_message):
        return f"output/{input_message['OperationId']}/{file}"


