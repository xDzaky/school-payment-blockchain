#!/bin/bash

echo "🏫 SchoolPay - Sistem Pembayaran Sekolah Blockchain"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan!"
    echo "Install dengan: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    ./install.sh
fi

# Check MongoDB connection
echo "🗄️  Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  MongoDB local tidak berjalan."
    echo "Pilihan:"
    echo "1. Jalankan MongoDB local: sudo systemctl start mongod"
    echo "2. Atau setup MongoDB Atlas (cloud) - lihat mongodb-atlas-setup.md"
    echo "3. Atau jalankan: ./setup-mongodb.sh"
    echo ""
    read -p "Lanjutkan tanpa MongoDB? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB connected"
    
    # Seed demo data
    echo "🌱 Seeding demo data..."
    cd server && node seedData.js && cd ..
fi

echo ""
echo "🚀 Starting SchoolPay..."
echo "================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "📱 Demo Accounts:"
echo "👨‍👩‍👧‍👦 Parent: parent@demo.com / password123"
echo "👨‍💼 Admin:  admin@demo.com / password123"
echo ""
echo "🔗 Blockchain: Polygon Mumbai Testnet"
echo "💰 Wallet: Connect MetaMask untuk transaksi"
echo ""

npm run dev