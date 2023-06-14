import json
import os
import subprocess
import traceback
from concurrent.futures import ThreadPoolExecutor
from abc import ABCMeta, abstractmethod
from time import sleep

from azure.storage.blob import BlobServiceClient, BlobClient
from azure.servicebus import ServiceBusClient


class WorkerBase(metaclass=ABCMeta):
    def __init__(self, queue_endpoint_url, storage_endpoint_url, input_queue_name, output_queue_name):
        self.command_name = "Demucs"
        self.blob_service_client = BlobServiceClient.from_connection_string(storage_endpoint_url)
        self.input_queue_name = input_queue_name
        self.output_queue_name = output_queue_name
        self.output_format = "mp3"
        self.endpoint_url = queue_endpoint_url
        self.servicebus_client = ServiceBusClient.from_connection_string(queue_endpoint_url)

        self.queue_receive_client = self.servicebus_client.get_queue_receiver(
            input_queue_name,
            max_wait_time=10
        )

    def ensure_queue_exists(self, queue_name):
        pass;

    def receive_message(self):
        messages = self.queue_receive_client.receive_messages(max_message_count=1, max_wait_time=10)
        if messages:
            message = messages[0]
            receipt_handle = message.lock_token
            body = message.body
            print("Message Body: ", body)
            return receipt_handle, body, message
        return None, None, None

    def delete_message(self, queue_name, receipt_handle):
        self.queue_receive_client.complete_message(receipt_handle)
        print(f"Message {receipt_handle} removed from queue...")

    def send_message(self, queue_name, payload):
        servicebus_client = self.servicebus_client
        with servicebus_client:
            queue_client = servicebus_client.get_queue_sender(queue_name)
            message = json.dumps(payload)
            queue_client.send_messages(message)
        print("Message sent:", message)

    def execute_command(self, file, message):
        os.chdir("/data/")
        result = subprocess.run(self.get_command_params(file, message))
        print(f"Subprocess returned status: {result.returncode}")
        return result.check_returncode()

    @abstractmethod
    def get_command_params(self, file, message):
        pass

    def download_from_storage(self, container_name, remote_path, local_path):
        blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=remote_path)
        with open(local_path, "wb") as file:
            file.write(blob_client.download_blob().readall())
        print(f"Downloaded from Azure Blob Storage: {remote_path} into {local_path}")

    def upload_results(self, container_name, local_path, remote_path, input_message):
        result = []

        print(f"Remote path 1 {remote_path}")

        files_to_upload, folder_name, output_path, remote_path = self.get_files_to_upload(local_path, remote_path,
                                                                                          input_message)

        print(f"Remote path 2 {remote_path}")

        for file in files_to_upload:
            output_file = os.path.join(output_path, file)
            blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=remote_path)
            blob_path = self.get_blob_path(file, input_message)

            print(f"Blob Path: {blob_path}")
            print(f"Uploading file: {output_file} to {blob_path}...")
            with open(output_file, "rb") as data:
                blob_client.upload_blob(data, blob_type="BlockBlob")
            result.append(blob_path)
            print("Done")

        return result

    @abstractmethod
    def get_blob_path(self, file, input_message):
        pass

    def get_files_to_upload(self, local_path, remote_path, input_message):
        folder_name, output_path, remote_path = self.get_path_details(local_path, remote_path, input_message)
        files_to_upload = []

        if output_path is not None:
            for root, dirs, files in os.walk(output_path):
                for file in files:
                    files_to_upload.append(file)

        return files_to_upload, folder_name, output_path, remote_path

    @abstractmethod
    def get_path_details(self, local_path, remote_path, input_message):
        pass

    @abstractmethod
    def get_output_dir(self, message):
        pass

    @abstractmethod
    def create_output_message(self, input_message, save_path):
        pass

    @abstractmethod
    def get_local_path(self, file_info):
        pass

    def get_data_container(self):
        return "revoicer"

    def receive_from_input_queue(self):
        return self.receive_message()

    def ensure_all_queues_exist(self):
        self.ensure_queue_exists(self.input_queue_name)
        self.ensure_queue_exists(self.output_queue_name)

    @abstractmethod
    def get_remote_path(self, input_message):
        pass

    def convert_file_to_output_format(self, input_file):
        filename, _ = os.path.splitext(input_file)
        output_file = f"{filename}.{self.output_format}"
        subprocess.call(["ffmpeg", "-i", input_file, "-c:a", self.output_format, output_file])
        print(f"Converted {input_file} to {self.output_format}")

    def convert_folder_to_output_format(self, folder):
        print(f"Converting .wav files in {folder} to {self.output_format}")
        wav_files = [file for file in os.listdir(folder) if file.endswith(".wav")]
        with ThreadPoolExecutor() as executor:
            executor.map(self.convert_file_to_output_format, [os.path.join(folder, file) for file in wav_files])

    def convert_to_output_format(self, local_path, input_message):
        folder_name, output_path, _ = self.get_path_details(local_path, local_path, input_message)
        self.convert_folder_to_output_format(output_path)

    def run(self):
        print("Starting...")

        print("Ensuring queues exist...")
        self.ensure_all_queues_exist()

        print(f"Listening to input queue: {self.input_queue_name}...")

        while True:
            receipt_handle = None
            try:
                (receipt_handle, body, _) = self.receive_from_input_queue()
                if body is not None:
                    body = body.replace("'", "\"")
                    input_message = json.loads(body)
                    remote_path = self.get_remote_path(input_message)
                    local_path = self.get_local_path(input_message)
                    container_name = self.get_data_container()
                    print(f"Downloading from Azure Blob Storage: {container_name}/{remote_path} into {local_path}")

                    self.download_from_storage(container_name, remote_path, local_path)

                    self.execute_command(local_path, input_message)
                    self.convert_to_output_format(local_path, input_message)
                    results = self.upload_results(container_name, local_path, "output", input_message)
                    output_message = self.create_output_message(input_message, results)
                    self.send_message(self.output_queue_name, output_message)
                    self.delete_message(self.input_queue_name, receipt_handle)

                sleep(1)
            except Exception as error:
                traceback.print_exc()
                if receipt_handle is not None:
                    self.delete_message(self.input_queue_name, receipt_handle)
                continue
