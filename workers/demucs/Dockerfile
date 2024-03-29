# Base image supports Nvidia CUDA but does not require it and can also run demucs on the CPU
FROM nvidia/cuda:11.8.0-base-ubuntu22.04

USER root
ENV TORCH_HOME=/data/models

# Install required tools
# Notes:
#  - build-essential and python3-dev are included for platforms that may need to build some Python packages (e.g., arm64)
#  - torchaudio >= 0.12 now requires ffmpeg on Linux, see https://github.com/facebookresearch/demucs/blob/main/docs/linux.md
RUN apt update && apt install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    git \
    python3 \
    python3-dev \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Clone Facebook Demucs
RUN git clone -b main --single-branch https://github.com/facebookresearch/demucs /lib/demucs
WORKDIR /lib/demucs

# Install dependencies
RUN python3 -m pip install -e . --no-cache-dir
# Run once to ensure demucs works and trigger the default model download
RUN python3 -m demucs -d cpu test.mp3
# Cleanup output - we just used this to download the model
RUN rm -r separated

ENV PYTHONUNBUFFERED 1

VOLUME /app/workers
VOLUME /data
WORKDIR /app

# Install dependencies
RUN python3 -m pip install \
    aiohttp==3.8.4 \
    azure-storage-blob==12.16.0 \
    azure-servicebus==7.11.0 \
    boto3==1.26.131 \
    botocore==1.29.131 \
    cancel-token==0.1.6 \
    jmespath==1.0.1 \
    marshmallow-dataclass==8.5.14 \
    pip==22.0.4 \
    python-dateutil==2.8.2 \
    s3transfer==0.6.1 \
    setuptools==58.1.0 \
    six==1.16.0 \
    urllib3==1.26.15

# RUN python3 -m pip install git+https://github.com/facebookresearch/demucs.git@main#egg=demucs
ENTRYPOINT /usr/bin/env bash ./workers/bootstrap.sh