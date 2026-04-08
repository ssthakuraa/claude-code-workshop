#!/usr/bin/env bash
# HR Enterprise Platform — Start Script
# Starts backend and frontend services

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== HR Enterprise Platform Startup ==="
echo ""

# Check if MySQL is running
echo "Checking MySQL..."
if ! mysqladmin ping -h localhost -u root --silent 2>/dev/null; then
    echo "MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
    sleep 3
fi
echo "✓ MySQL is running"
echo ""

# Start backend
echo "Starting backend service..."
cd "$PROJECT_ROOT/backend"
if pgrep -f "hrapp-service" > /dev/null; then
    echo "Backend is already running (PID: $(pgrep -f hrapp-service))"
else
    nohup mvn spring-boot:run -pl hrapp-service > "$PROJECT_ROOT/backend/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "Backend starting (PID: $BACKEND_PID)..."
    sleep 20
fi
echo ""

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
MAX_WAIT=30
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✓ Backend is ready on http://localhost:8080"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo "⚠ Backend did not become ready within $MAX_WAIT seconds"
    echo "Check logs: tail -f $PROJECT_ROOT/backend/backend.log"
fi
echo ""

# Start frontend
echo "Starting frontend development server..."
cd "$PROJECT_ROOT/frontend"
if pgrep -f "vite" > /dev/null; then
    echo "Frontend dev server is already running (PID: $(pgrep -f "vite"))"
else
    nohup npm run dev > "$PROJECT_ROOT/frontend/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend dev server starting (PID: $FRONTEND_PID)..."
    sleep 8
fi
echo ""

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
MAX_WAIT=30
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✓ Frontend is ready on http://localhost:5173"
        break
    fi
    sleep 2
    WAITED=$((WAITED + 2))
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo "⚠ Frontend did not become ready within $MAX_WAIT seconds"
    echo "Check logs: tail -f $PROJECT_ROOT/frontend/frontend.log"
fi
echo ""

echo "=== Application Started ==="
echo ""
echo "Backend API:  http://localhost:8080/app/hr/api/v1/"
echo "API Docs:     http://localhost:8080/app/hr/swagger-ui.html"
echo "Frontend:     http://localhost:5173"
echo ""
echo "To stop the application: bash $SCRIPT_DIR/stopApp.sh"
echo ""
echo "Logs:"
echo "  Backend:  tail -f $PROJECT_ROOT/backend/backend.log"
echo "  Frontend: tail -f $PROJECT_ROOT/frontend/frontend.log"
