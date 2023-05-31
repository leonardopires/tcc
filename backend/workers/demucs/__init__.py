from backend.workers.demucs.app.DemucsWorker import DemucsWorker

# Settings
ENDPOINT_URL = "http://localstack:4566"
AWS_REGION = "us-east-1"
INPUT_QUEUE_NAME = 'revoicer-demucs-input.fifo'
OUTPUT_QUEUE_NAME = 'revoicer-demucs-output.fifo'


demucs = DemucsWorker(ENDPOINT_URL, AWS_REGION, INPUT_QUEUE_NAME, OUTPUT_QUEUE_NAME)
demucs.run()

