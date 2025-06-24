#!/usr/bin/env bash
# Runs main docs and versioned AID spec concurrently for local development
# main: http://127.0.0.1:8000
# aid : http://127.0.0.1:8001/aid/latest/
set -e

# Start AID spec via mike serve in background on port 8001
mike serve --config-file mkdocs-aid.yml -a 127.0.0.1:8001 &
AID_PID=$!

# Kill the background process when this script exits
trap 'kill ${AID_PID}' EXIT

# Run main docs in the foreground on port 8000
mkdocs serve -f mkdocs-dev.yml -a 127.0.0.1:8000 