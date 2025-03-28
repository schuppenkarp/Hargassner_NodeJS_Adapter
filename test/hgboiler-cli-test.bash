#!/bin/bash

node -e "require('./test/mockserver.js').start(1025, () => console.log('Mock server running on port 1025'))" & MOCK_SERVER_PID=$!
sleep 2

echo "Running tests..."
node ./bin/hgboiler.js --ip 0.0.0.0 --port 1025 --once true

echo "Stopping mock server..."
kill $MOCK_SERVER_PID
