#!/bin/bash

# E2E Test Runner
# Ensures dev server is running before executing Playwright tests

echo "🔍 Checking if dev server is running on port 3002..."

if lsof -ti:3002 > /dev/null 2>&1; then
    echo "✅ Server is already running"
else
    echo "🚀 Starting dev server..."
    npm start > /dev/null 2>&1 &
    SERVER_PID=$!
    
    echo "⏳ Waiting for server to be ready..."
    timeout=30
    elapsed=0
    
    until curl -s http://localhost:3002 > /dev/null 2>&1; do
        if [ $elapsed -ge $timeout ]; then
            echo "❌ Server failed to start within ${timeout} seconds"
            kill $SERVER_PID 2>/dev/null
            exit 1
        fi
        sleep 1
        elapsed=$((elapsed + 1))
        echo -n "."
    done
    
    echo ""
    echo "✅ Server is ready!"
    echo "📝 Server PID: $SERVER_PID"
    echo "💡 To stop the server later, run: kill $SERVER_PID"
    echo ""
fi

echo "🎭 Running Playwright tests..."
echo ""

# Run the tests with all arguments passed through
npm run test:e2e -- "$@"

# Capture the exit code
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Some tests failed (exit code: $TEST_EXIT_CODE)"
fi

exit $TEST_EXIT_CODE
