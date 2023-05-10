import subprocess
import json
import os
import boto3

from time import sleep

# Settings
ENDPOINT_URL = "http://localstack:4566"
AWS_REGION = "us-east-1"
QUEUE_NAME = 'revoicer-demucs'

print("Starting...")

sqs = boto3.client("sqs", endpoint_url=ENDPOINT_URL, region_name=AWS_REGION)
s3 = boto3.client("s3", endpoint_url=ENDPOINT_URL, region_name=AWS_REGION)


def ensure_queue_exists(queue_name):
    response = sqs.create_queue(
        QueueName=queue_name,
        Attributes={
            'MessageRetentionPeriod': '86400'
        },
    )
    return response


def get_queue_url(queue_name):
    response = sqs.get_queue_url(QueueName=queue_name)
    url = response["QueueUrl"]
    return url


def receive_message(queue_name):
    url = get_queue_url(queue_name)

    response = sqs.receive_message(
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

    message = ""
    receipt_handle = ""
    body = ""

    if "Messages" in response.keys():
        messages = response["Messages"]
        message = messages[0]
        receipt_handle = message["ReceiptHandle"]
        body = message["Body"]
        print(body)
    #    else:
    #        print("No message found")

    return receipt_handle, body, message


def run_demucs(file):
    result = subprocess.run([
        "demucs",
        "--mp3",
        "-d=cuda",
        "-n=htdemucs",
        "--two-stems=vocals",
        "-j=12",
        "-v",
        file
    ])
    return result.returncode


def download_from_s3(bucket, path, output_file):
    index = output_file.rindex("/")
    output_path = output_file[0:index:]

    if not os.path.exists(output_path):
        os.makedirs(output_path)

    s3.download_file(bucket, path, output_file)


def delete_message(queue_name, receipt_handle):
    url = get_queue_url(queue_name)
    sqs.delete_message(QueueUrl=url, ReceiptHandle=receipt_handle)


def main():
    print("Ensuring queue exists...")
    ensure_queue_exists(QUEUE_NAME)
    print("Listening to queue...")

    while True:
        # print("Waiting for message from queue...")

        (receiptHandle, body, _) = receive_message(QUEUE_NAME)

        if body != "":
            file_info = json.loads(body)
            output_path = file_info["FilePath"]
            path = file_info["FilePath"][1::]
            bucket = "revoicer"
            print(f"Downloading from S3: s3://{bucket}/{path}")
            print(s3.list_objects(Bucket=bucket, Prefix="data"))
            download_from_s3(bucket, path, output_path)

            if run_demucs(output_path) == 0:
                print(f"Demucs successful: deleting message {receiptHandle}")
                delete_message(QUEUE_NAME, receiptHandle)

        sleep(1)


main()
