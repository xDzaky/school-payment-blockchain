#!/bin/bash

echo "🗄️  Setting up MongoDB Local"
echo "============================"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    
    # Import MongoDB public GPG key
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    
    # Create list file for MongoDB
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    # Update package database
    sudo apt-get update
    
    # Install MongoDB
    sudo apt-get install -y mongodb-org
    
    # Start MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    echo "✅ MongoDB installed and started"
else
    echo "✅ MongoDB already installed"
    
    # Start MongoDB if not running
    if ! pgrep -x "mongod" > /dev/null; then
        echo "Starting MongoDB..."
        sudo systemctl start mongod
    fi
fi

echo "✅ MongoDB is ready!"
echo "Connection string: mongodb://localhost:27017/school_payment"