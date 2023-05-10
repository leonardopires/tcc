import subprocess
import json
import os
import boto3
import sys
import demucs.separate

from time import sleep

print("Starting...")

sqs = boto3.client("sqs", endpoint_url="http://localstack:4566", region_name="us-east-1")
s3 = boto3.client("s3", endpoint_url="http://localstack:4566", region_name="us-east-1")

QUEUE_NAME = 'revoicer-demucs'

def ensureQueueExists(queueName):
    response = sqs.create_queue(
        QueueName=queueName,               
        Attributes={
            'MessageRetentionPeriod': '86400'
        },
    )
    return response

def getQueueUrl(queueName):
    response = sqs.get_queue_url(QueueName=queueName)
    url=response["QueueUrl"]
    return url

def receiveMessage(queueName):
    url = getQueueUrl(queueName)

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
    
    message=""
    receiptHandle=""
    body=""

    if ("Messages" in response.keys()): 
        messages = response["Messages"]
        message = messages[0]
        receiptHandle = message["ReceiptHandle"]
        body = message["Body"]
        print (body)
    else:
        print("No message found")

    return (receiptHandle, body, message)

def runDemucs(file):
    result = subprocess.run(["demucs", "--mp3", "-d=cuda", "-n=htdemucs", "--two-stems=vocals", "-j=12", "-v", file])
    return result.returncode

def downloadFromS3(bucket, path, outputFile):
    index = outputFile.rindex("/")
    outputPath = outputFile[0:index:]

    if not os.path.exists(outputPath):
        os.makedirs(outputPath)
        
    s3.download_file(bucket, path, outputFile)

def deleteMessage(queueName, receiptHandle):
    url = getQueueUrl(queueName)
    response = sqs.delete_message(QueueUrl=url, ReceiptHandle=receiptHandle)

def main():
    print("Ensuring queue exists...")
    ensureQueueExists(QUEUE_NAME)


    while True:
        print("Waiting for message from queue...")


        (receiptHandle, body, _) = receiveMessage(QUEUE_NAME)

        if body != "":
            fileInfo = json.loads(body)
            outputPath = fileInfo["FilePath"]
            path = fileInfo["FilePath"][1::]
            bucket = "revoicer"
            print(f"Downloading from S3: s3://{bucket}/{path}")
            print(s3.list_objects(Bucket=bucket, Prefix="data"))
            downloadFromS3(bucket, path, outputPath)

            if (runDemucs(outputPath) == 0):
                print(f"Demucs successful: deleting message {receiptHandle}")
                deleteMessage(QUEUE_NAME, receiptHandle)

        sleep(1)


main()