#!/usr/bin/env bash
# HR Enterprise Platform — Stop Script
# Stops backend and frontend services

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== HR Enterprise Platform Shutdown ==="
echo ""

# Stop backend
echo "Stopping backend service..."
if pgrep -f "hrapp-service" > /dev/null; then
    pkill -f "hrapp-service"
    echo "✓ Backend stopped"
else
    echo "Backend is not running"
fi
echo ""

# Stop frontend
echo "Stopping frontend dev server..."
if pgrep -f "vite" > /dev/null; then
    pkill -f "vite"
    echo "✓ Frontend dev server stopped"
else
    echo "Frontend dev server is not running"
fi
echo ""

echo "=== Application Stopped ==="
echo ""
echo "To restart: $SCRIPT_DIR/startApp.sh"
