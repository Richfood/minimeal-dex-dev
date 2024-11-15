#!/bin/bash

# Define the PM2 process name
PROCESS_NAME="dev-dex-frontend"

# Stopping the specific PM2 process by name
echo "Stopping the PM2 process named $PROCESS_NAME"

# Optionally, delete the process if you don't want it listed in PM2 anymore
# pm2 delete "$PROCESS_NAME"
