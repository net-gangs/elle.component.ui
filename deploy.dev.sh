#!/bin/bash

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

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2 globally..."
    # Try to install PM2 with npm as fallback
    npm install -g pm2 || {
        warn "Failed to install PM2 globally with npm, trying with pnpm setup..."
        # Setup pnpm global if needed
        export PNPM_HOME="$HOME/.local/share/pnpm"
        export PATH="$PNPM_HOME:$PATH"
        mkdir -p "$PNPM_HOME"
        
        pnpm install -g pm2 || {
            error "Failed to install PM2 globally. Please install PM2 manually."
            exit 1
        }
    }
else
    log "PM2 is already installed"
fi

# Setup Node.js version with nvm if available
if command -v nvm &> /dev/null; then
    log "Setting up Node.js version 20..."
    nvm use 25 || {
        warn "Failed to use Node.js 20, using system default"
    }
elif command -v node &> /dev/null; then
    log "Using system Node.js version: $(node --version)"
else
    error "Node.js is not installed"
    exit 1
fi

log "Starting Elle UI in staging mode (daemon)..."

pm2 delete elle-ui-staging 2>/dev/null || true

pm2 start pnpm --name "elle-ui-staging" -- staging || {
    error "Failed to start application with PM2"
    
    warn "Falling back to nohup..."
    nohup pnpm staging > "$APP_DIR/staging.log" 2>&1 &
    echo $! > "$APP_DIR/staging.pid"
    
    if [ $? -eq 0 ]; then
        log "Application started successfully with nohup (PID: $(cat $APP_DIR/staging.pid))"
    else
        error "Failed to start application"
        exit 1
    fi
}

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
    log "Check logs at: $APP_DIR/staging.log or run 'pm2 logs elle-ui-staging'"
    exit 1
fi
