FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

USER root
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    vim \
    dnsutils \
    netcat-openbsd \
    ldap-utils \
    iputils-ping \
    wget \
    curl \
    gnupg && \
    && rm -rf /var/vector/apt/lists/*

RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY gitkey/id_ed25519 /root/.ssh/id_ed25519
COPY gitkey/id_ed25519.pub /root/.ssh/id_ed25519.pub
RUN chmod 600 /root/.ssh/id_ed25519 && chmod 644 /root/.ssh/id_ed25519.pub

RUN pip3 install --upgrade pip

RUN pip3 install numpy \
    evaluate \
    seqeval \
    transformers[torch] \
    accelerate \
    datasets

CMD ["sleep", "infinity"]