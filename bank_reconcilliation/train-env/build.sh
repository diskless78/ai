#!/bin/bash

# Variables
IMAGE_NAME="nvidia-cuda"
REGISTRY="harbor.centralretail.com.vn"
PROJECT="group_platform"
TAG="12.1.0"
FULL_IMAGE_NAME="$REGISTRY/$PROJECT/$IMAGE_NAME:$TAG"

# Build the Docker image
echo "Building Docker image..."
sudo docker build -t "$IMAGE_NAME" .

# Tag the Docker image
echo "Tagging Docker image..."
sudo docker tag "$IMAGE_NAME" "$FULL_IMAGE_NAME"

# Login to Harbor registry
echo "Logging into Harbor registry..."
sudo docker login -u admin -p 'QWRtaW5AMTIz' "$REGISTRY"

# Push the Docker image
echo "Pushing Docker image to registry..."
sudo docker push "$FULL_IMAGE_NAME"

# Cleanup Docker images and cache
echo "Cleaning up Docker cache and unused images..."
sudo docker rmi "$FULL_IMAGE_NAME" "$IMAGE_NAME"
sudo docker image prune -a -f
sudo docker container prune -f
sudo docker volume prune -f
sudo docker system prune -a -f

echo "Process completed successfully!"