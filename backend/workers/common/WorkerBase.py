import json
import os
import subprocess
import traceback
import uuid
from types import TracebackType

import boto3
from abc import ABCMeta, abstractmethod
from time import sleep


class WorkerBase(metaclass=ABCMeta):
    def __init__(self, endpoint_url, aws_region, input_queue_name, output_queue_name):
        self.command_name = "Demucs"
        self.sqs = boto3.client("sqs", endpoint_url=endpoint_url, region_name=aws_region)
        self.s3 = boto3.client("s3", endpoint_url=endpoint_url, region_name=aws_region)
        self.input_queue_name = input_queue_name
        self.output_queue_name = output_queue_name

    def ensure_queue_exists(self, queue_name):
        response = self.sqs.create_queue(
            QueueName=queue_name,
            Attributes={
                'MessageRetentionPeriod': '86400',
                'FifoQueue': 'true',
            },
        )
        return response

    def get_queue_url(self, queue_name):
        response = self.sqs.get_queue_url(QueueName=queue_name)
        url = response["QueueUrl"]
        return url

    def receive_message(self, queue_name):
        url = self.get_queue_url(queue_name)

        response = self.sqs.receive_message(
            QueueUrl=url,
            AttributeNames=[
                'SentTimestamp'
            ],
            MaxNumberOfMessages=1,
            MessageAttributeNames=[
                'All'
            ],
            VisibilityTimeout=0,
            WaitTimeSeconds=0
        )

        message = None
        receipt_handle = None
        body = None

        if "Messages" in response.keys():
            messages = response["Messages"]
            message = messages[0]
            receipt_handle = message["ReceiptHandle"]
            body = message["Body"]
            print("Message Body: ", body)
        #    else:
        #        print("No message found")

        return receipt_handle, body, message

    def delete_message(self, queue_name, receipt_handle):
        url = self.get_queue_url(queue_name)
        self.sqs.delete_message(QueueUrl=url, ReceiptHandle=receipt_handle)
        print(f"Message {receipt_handle} removed from queue...")

    def send_message(self, queue_name, payload):
        url = self.get_queue_url(queue_name)
        body = json.dumps(payload)
        response = self.sqs.send_message(
            QueueUrl=url,
            MessageBody=body,
            MessageDeduplicationId=str(uuid.uuid4()),
            MessageGroupId=str(uuid.uuid4()),
        )
        print("Message sent:", body)
        return response

    def execute_command(self, file, message):
        os.chdir("/data/")
        result = subprocess.run(self.get_command_params(file, message))
        print(f"Subprocess returned status: {result.returncode}")
        return result.check_returncode()

    @abstractmethod
    def get_command_params(self, file, message):
        pass

    def download_from_s3(self, bucket, remote_path, local_path):
        index = local_path.rfind("/")
        if index >= 0:
            output_path = local_path[0:index:]

            if not os.path.exists(output_path):
                os.makedirs(output_path)

            print(f"Downloading from S3: {remote_path} into {local_path}")
            self.s3.download_file(bucket, remote_path, local_path)

    def upload_results(self, bucket, local_path, remote_path, input_message):
        result = []

        print(f"Remote path 1 {remote_path}")

        files_to_upload, folder_name, output_path, _ = self.get_files_to_upload(local_path, remote_path, input_message)

        print(f"Remote path 2 {remote_path}")

        for file in files_to_upload:
            output_file = os.path.join(output_path, file)

            if folder_name is None:
                s3_path = f"{remote_path}/{file}"
            else:
                s3_path = f"{remote_path}/{folder_name}/{file}"

            print(f"S3 Path: {s3_path}")
            print(f"Uploading file: {output_file} to {s3_path}...")
            self.s3.upload_file(output_file, bucket, s3_path)
            result.append(s3_path)
            print("Done")

        return result

    def get_files_to_upload(self, local_path, remote_path, input_message):
        folder_name, output_path, remote_path = self.get_path_details(local_path, remote_path, input_message)
        files_to_upload = []

        if output_path is not None:
            for root, dirs, files in os.walk(output_path):
                for file in files:
                    files_to_upload.append(file)

        return files_to_upload, folder_name, output_path, remote_path

    def get_path_details(self, local_path, remote_path, input_message):
        index = local_path.rfind("/") + 1

        if index > 0:
            output_dir = self.get_output_dir(local_path)
            file_name = local_path[index::]
            extension_index = file_name.rfind(".")
            folder_name = file_name[0:extension_index:]
            output_path = os.path.join(output_dir, folder_name)
            print(f"Input File Name: {file_name}")
            print(f"Path: {local_path}")
            print(f"Output Path: {output_path}")
            dir_contents = os.listdir(output_dir)
            print(dir_contents)

            return folder_name, output_path, remote_path

        return None, None, remote_path

    @abstractmethod
    def get_output_dir(self, message):
        pass

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
                    bucket = self.get_data_bucket()
                    print(f"Downloading from S3: s3://{bucket}/{remote_path} into {local_path}")
                    # print(self.s3.list_objects(Bucket=bucket, Prefix="data"))

                    self.download_from_s3(bucket, remote_path, local_path)

                    self.execute_command(local_path, input_message)
                    results = self.upload_results(bucket, local_path, "output", input_message)
                    output_message = self.create_output_message(input_message, results)
                    self.send_message(self.output_queue_name, output_message)
                    self.delete_message(self.input_queue_name, receipt_handle)

                sleep(1)
            except Exception as error:
                traceback.print_exc()
                if receipt_handle is not None:
                    self.delete_message(self.input_queue_name, receipt_handle)
                continue

    @abstractmethod
    def create_output_message(self, input_message, save_path):
        pass

    @abstractmethod
    def get_local_path(self, file_info):
        pass

    def get_data_bucket(self):
        return "revoicer"

    def receive_from_input_queue(self):
        return self.receive_message(self.input_queue_name)

    def ensure_all_queues_exist(self):
        self.ensure_queue_exists(self.input_queue_name)
        self.ensure_queue_exists(self.output_queue_name)

    @abstractmethod
    def get_remote_path(self, input_message):
        pass