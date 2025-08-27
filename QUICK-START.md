# 🚀 Quick Start Guide - SchoolPay

## Langkah Cepat (5 menit):

### 1. Install Dependencies
```bash
cd /home/dzaky/Desktop/Project
./install.sh
```

### 2. Setup Database (Pilih salah satu)

**Opsi A: MongoDB Local (Recommended)**
```bash
./setup-mongodb.sh
```

**Opsi B: MongoDB Atlas (Cloud)**
- Baca file: `mongodb-atlas-setup.md`
- Update `.env` dengan connection string Atlas

### 3. Jalankan Aplikasi
```bash
./start.sh
```

### 4. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### 5. Login Demo
- **Parent**: parent@demo.com / password123
- **Admin**: admin@demo.com / password123

---

## Troubleshooting:

### Error: "Node.js not found"
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Error: "MongoDB connection failed"
```bash
# Start MongoDB local
sudo systemctl start mongod

# Or check MongoDB status
sudo systemctl status mongod
```

### Error: "Port already in use"
```bash
# Kill processes on port 3000 and 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

### Error: "Permission denied"
```bash
chmod +x *.sh
```

---

## Yang Perlu Diubah:

### ✅ Sudah Dikonfigurasi:
- [x] Environment variables (.env)
- [x] JWT Secret key
- [x] Polygon RPC URL
- [x] Demo data seeding
- [x] Package.json scripts

### 🔧 Yang Mungkin Perlu Disesuaikan:

1. **Database Connection**
   - MongoDB local: `mongodb://localhost:27017/school_payment`
   - MongoDB Atlas: Update di `.env` file

2. **Blockchain Configuration** (Opsional)
   - Private key untuk deployment smart contract
   - Contract address setelah deploy

3. **Port Configuration** (Jika bentrok)
   - Frontend: 3000 (bisa diubah di client/package.json)
   - Backend: 5000 (bisa diubah di server/.env)

---

## Fitur yang Bisa Digunakan:

### 👨‍👩‍👧‍👦 Parent Dashboard:
- ✅ Login dengan MetaMask
- ✅ Lihat tagihan pending
- ✅ Bayar via blockchain
- ✅ Generate QR code
- ✅ Riwayat pembayaran

### 👨‍💼 Admin Dashboard:
- ✅ Monitor semua pembayaran
- ✅ Laporan keuangan
- ✅ Statistik per kategori
- ✅ Manajemen transaksi

### 🔗 Blockchain Features:
- ✅ Polygon Mumbai testnet
- ✅ MetaMask integration
- ✅ Transaction verification
- ✅ Smart contract interaction

---

**🎉 Selamat! SchoolPay siap digunakan!**