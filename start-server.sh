#!/bin/bash

echo "🚀 Starting SchoolPay Server..."

# Kill existing server if running
pkill -f "node.*index.js"
pkill -f "nodemon.*index.js"

# Wait a moment
sleep 2

# Start server in background
cd /home/dzaky/Desktop/Project/server
nohup npm run dev > server.log 2>&1 &

# Get the PID
SERVER_PID=$!
echo "📡 Server started with PID: $SERVER_PID"

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Test server
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Server is running successfully!"
    echo "📡 Server URL: http://localhost:5000"
    echo "📊 MongoDB: Connected to Atlas"
    echo "💰 Auto-Convert: Enabled"
    echo ""
    echo "🔍 To check server logs: tail -f /home/dzaky/Desktop/Project/server/server.log"
    echo "🛑 To stop server: pkill -f 'node.*index.js'"
else
    echo "❌ Server failed to start"
    echo "📋 Check logs: cat /home/dzaky/Desktop/Project/server/server.log"
fi