#!/bin/bash
set -e

echo "🚀 Deploying Elle UI to Homelab..."

# Variables
APP_DIR="/home/admin/apps/netgang/ella/ui"
DOCKER_TAG=${DOCKER_IMAGE_TAG:+sha-$DOCKER_IMAGE_TAG}
DOCKER_IMAGE="ghcr.io/xwyvernpx/elle-ui:${DOCKER_TAG:-latest}"

# Create app directory if it doesn't exist
echo "📁 Creating application directory..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Pull the latest Docker image
echo "📥 Pulling Docker image: $DOCKER_IMAGE"
docker pull "$DOCKER_IMAGE"

# Stop and remove old containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down || true

# Start services
echo "▶️  Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check service status
echo "✅ Checking service status..."
docker-compose -f docker-compose.production.yml ps

# Clean up old images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✨ Deployment completed successfully!"
