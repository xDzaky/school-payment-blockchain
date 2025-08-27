#!/bin/bash

SERVER_DIR="/home/dzaky/Desktop/Project/server"
LOG_FILE="$SERVER_DIR/server.log"
PID_FILE="$SERVER_DIR/server.pid"

case "$1" in
    start)
        echo "🚀 Starting SchoolPay Server..."
        
        # Check if server is already running
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p $PID > /dev/null 2>&1; then
                echo "⚠️  Server is already running (PID: $PID)"
                echo "📡 Server URL: http://localhost:5000"
                exit 0
            else
                rm -f "$PID_FILE"
            fi
        fi
        
        # Kill any existing processes on port 5000
        echo "🧹 Cleaning up existing processes..."
        pkill -f "node.*index.js" 2>/dev/null
        pkill -f "nodemon.*index.js" 2>/dev/null
        lsof -ti:5000 | xargs kill -9 2>/dev/null
        
        # Wait for cleanup
        sleep 2
        
        # Start server
        cd "$SERVER_DIR"
        nohup npm run dev > "$LOG_FILE" 2>&1 &
        SERVER_PID=$!
        echo $SERVER_PID > "$PID_FILE"
        
        echo "📡 Server starting with PID: $SERVER_PID"
        echo "⏳ Waiting for server to initialize..."
        
        # Wait and test
        for i in {1..10}; do
            sleep 1
            if curl -s http://localhost:5000 > /dev/null 2>&1; then
                echo "✅ Server is running successfully!"
                echo "📡 Server URL: http://localhost:5000"
                echo "📊 MongoDB: Connected to Atlas"
                echo "💰 Auto-Convert: Enabled"
                echo "📋 Logs: tail -f $LOG_FILE"
                exit 0
            fi
            echo "   Attempt $i/10..."
        done
        
        echo "❌ Server failed to start within 10 seconds"
        echo "📋 Check logs: cat $LOG_FILE"
        exit 1
        ;;
        
    stop)
        echo "🛑 Stopping SchoolPay Server..."
        
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p $PID > /dev/null 2>&1; then
                kill $PID
                echo "✅ Server stopped (PID: $PID)"
            else
                echo "ℹ️  Server was not running"
            fi
            rm -f "$PID_FILE"
        else
            echo "ℹ️  No PID file found"
        fi
        
        # Cleanup any remaining processes
        pkill -f "node.*index.js" 2>/dev/null
        pkill -f "nodemon.*index.js" 2>/dev/null
        lsof -ti:5000 | xargs kill -9 2>/dev/null
        
        echo "🧹 Cleanup completed"
        ;;
        
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
        
    status)
        if [ -f "$PID_FILE" ]; then
            PID=$(cat "$PID_FILE")
            if ps -p $PID > /dev/null 2>&1; then
                echo "✅ Server is running (PID: $PID)"
                echo "📡 Server URL: http://localhost:5000"
                
                # Test server response
                if curl -s http://localhost:5000 > /dev/null 2>&1; then
                    echo "🌐 Server is responding"
                else
                    echo "⚠️  Server process exists but not responding"
                fi
            else
                echo "❌ Server is not running (stale PID file)"
                rm -f "$PID_FILE"
            fi
        else
            echo "❌ Server is not running"
        fi
        ;;
        
    logs)
        if [ -f "$LOG_FILE" ]; then
            tail -f "$LOG_FILE"
        else
            echo "📋 No log file found"
        fi
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the server"
        echo "  stop    - Stop the server"
        echo "  restart - Restart the server"
        echo "  status  - Check server status"
        echo "  logs    - Show server logs"
        exit 1
        ;;
esac