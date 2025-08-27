#!/bin/bash

echo "🏫 SchoolPay - Installing Dependencies"
echo "====================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "Install Node.js dengan:"
    echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "sudo apt-get install -y nodejs"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Setup MongoDB (local or Atlas)"
echo "2. Run: npm run dev"