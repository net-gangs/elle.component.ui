#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

set -e

# Configuration
PORT="${DEPLOY_PORT:-5774}"
APP_DIR="$(pwd)"  # Use current working directory
LOG_FILE="$APP_DIR/deploy.log"


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log "Checking for service on port $PORT..."
PID=$(lsof -ti:$PORT || echo "")

if [ -n "$PID" ]; then
    log "Found process $PID running on port $PORT. Stopping it..."
    kill -9 $PID 2>/dev/null || {
        error "Failed to kill process $PID"
        exit 1
    }
    log "Process stopped successfully"
    sleep 2 
else
    log "No process found on port $PORT"
fi


log "Pulling latest code from develop branch..."
git fetch origin develop || {
    error "Failed to fetch from origin"
    exit 1
}

git pull origin develop || {
    error "Failed to pull from develop branch"
    exit 1
}

log "Code updated successfully"

# Check if dependencies need to be installed
if git diff HEAD@{1} HEAD --name-only | grep -q "package.json\|pnpm-lock.yaml"; then
    log "Package files changed, installing dependencies..."
    pnpm install --force || {
        error "Failed to install dependencies"
        exit 1
    }
else
    log "No dependency changes detected"
fi

# Setup Node.js version with nvm if available
if command -v nvm &> /dev/null; then
    log "Setting up Node.js version 25..."
    nvm use 25 || {
        warn "Failed to use Node.js 25, using system default"
    }
elif command -v node &> /dev/null; then
    log "Using system Node.js version: $(node --version)"
else
    error "Node.js is not installed"
    exit 1
fi

# Step 4: Start the UI in daemon mode with nohup
log "Starting Elle UI in staging mode (daemon)..."

# Start with nohup
nohup pnpm staging > "$APP_DIR/staging.log" 2>&1 &
echo $! > "$APP_DIR/staging.pid"

if [ $? -eq 0 ]; then
    log "Application started successfully with nohup (PID: $(cat $APP_DIR/staging.pid))"
else
    error "Failed to start application"
    exit 1
fi

sleep 5
NEW_PID=$(lsof -ti:$PORT || echo "")

if [ -n "$NEW_PID" ]; then
    log "✓ Deployment successful! Service is running on port $PORT (PID: $NEW_PID)"
    
    echo "Last deployment: $(date)" > "$APP_DIR/last-deploy.txt"
    echo "Git commit: $(git rev-parse --short HEAD)" >> "$APP_DIR/last-deploy.txt"
    echo "PID: $NEW_PID" >> "$APP_DIR/last-deploy.txt"
    
    log "Deployment completed successfully!"
    exit 0
else
    error "Service failed to start on port $PORT"
    log "Check logs at: $APP_DIR/staging.log"
    exit 1
fi
