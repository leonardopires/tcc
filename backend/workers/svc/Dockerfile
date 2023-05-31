FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime
RUN ["apt", "update", "--fix-missing"]
RUN ["apt", "install", "-y", "build-essential"]
RUN ["pip", "install", "-U", "pip", "setuptools", "wheel"]
RUN ["pip", "install", "-U", "so-vits-svc-fork==3.15.0"]

ENV PYTHONUNBUFFERED=1

VOLUME /app
VOLUME /data
WORKDIR /app

RUN python3 -m pip install \
    boto3==1.26.131 \
    botocore==1.29.131 \
    jmespath==1.0.1 \
    pip==22.0.4 \
    python-dateutil==2.8.2 \
    s3transfer==0.6.1 \
    setuptools==58.1.0 \
    six==1.16.0 \
    urllib3==1.26.15

ENTRYPOINT env python3 -m backend.workers.svc