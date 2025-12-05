#!/bin/bash
set -e

# ------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------
TARGET_DIR="${DEPLOY_PATH:-/home/admin/apps/netgang/ella/ui}"
COMPOSE_FILENAME="${COMPOSE_FILE:-docker-compose.production.yml}"

if [ -z "$DOCKER_IMAGE_TAG" ]; then
  DOCKER_TAG="latest"
else
  if [[ "$DOCKER_IMAGE_TAG" == sha-* ]]; then
    DOCKER_TAG="$DOCKER_IMAGE_TAG"
  else
    DOCKER_TAG="sha-$DOCKER_IMAGE_TAG"
  fi
fi

DOCKER_IMAGE="ghcr.io/xwyvernpx/elle-ui:$DOCKER_TAG"

echo "🚀 Deploying Elle UI..."
echo "📍 Target: $TARGET_DIR"
echo "📄 Config: $COMPOSE_FILENAME"
echo "📦 Image:  $DOCKER_IMAGE"

# ------------------------------------------------------------------
# DEPLOYMENT
# ------------------------------------------------------------------

echo "📁 Ensuring directory exists..."
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo "📥 Pulling Docker image..."
docker pull "$DOCKER_IMAGE"

echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILENAME" down || true

echo "▶️  Starting services..."
DOCKER_IMAGE_TAG="$DOCKER_TAG" docker-compose -f "$COMPOSE_FILENAME" up -d

echo "⏳ Waiting for services to initialize..."
sleep 5

echo "✅ Checking service status..."
docker-compose -f "$COMPOSE_FILENAME" ps

echo "🧹 Cleaning up old resources..."
docker image prune -f

echo "✨ Deployment completed successfully!"