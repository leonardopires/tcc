from backend.workers.svc.app.SvcWorker import SvcWorker

# Settings
ENDPOINT_URL = "http://localstack:4566"
AWS_REGION = "us-east-1"
INPUT_QUEUE_NAME = 'revoicer-svc-input.fifo'
OUTPUT_QUEUE_NAME = 'revoicer-svc-output.fifo'


svc = SvcWorker(ENDPOINT_URL, AWS_REGION, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)
svc.run()

