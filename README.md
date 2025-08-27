# 🏫 SchoolPay - Sistem Pembayaran Sekolah Berbasis Blockchain

Platform pembayaran sekolah modern yang menggunakan teknologi blockchain Polygon untuk transaksi yang aman, transparan, dan efisien.

## ✨ Fitur Utama

### 🎨 Frontend (React + Tailwind CSS)
- **Dashboard Orang Tua**: Kelola tagihan dan riwayat pembayaran
- **Integrasi MetaMask**: Login dan transaksi menggunakan wallet Polygon
- **QR Code Generator**: Alternatif pembayaran manual
- **Responsive Design**: Tampilan optimal di semua perangkat
- **Real-time Updates**: Status pembayaran terupdate otomatis

### ⚙️ Backend (Node.js + Express)
- **RESTful API**: Endpoint lengkap untuk semua fitur
- **MongoDB Integration**: Database untuk menyimpan data pembayaran
- **JWT Authentication**: Sistem login yang aman
- **Blockchain Integration**: Verifikasi transaksi di Polygon

### 🔗 Blockchain Integration
- **Polygon Network**: Transaksi cepat dengan biaya rendah
- **Smart Contract**: Pencatatan pembayaran di blockchain
- **Transaction Verification**: Verifikasi otomatis hash transaksi

### 📊 Admin Panel
- **Dashboard Admin**: Monitor semua pembayaran siswa
- **Laporan Keuangan**: Analisis pemasukan per bulan
- **Manajemen Pengguna**: Kelola data orang tua dan siswa

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js (v16 atau lebih baru)
- MongoDB (local atau cloud)
- MetaMask browser extension
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd school-payment-blockchain
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install semua dependencies (server + client)
npm run install-all
```

### 3. Setup Environment Variables
Buat file `.env` di folder `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_payment
JWT_SECRET=your_jwt_secret_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_contract_address_here
```

### 4. Setup Database
```bash
# Jalankan MongoDB (jika menggunakan local)
mongod

# Seed demo data
cd server
node seedData.js
```

### 5. Jalankan Aplikasi
```bash
# Jalankan server dan client bersamaan
npm run dev

# Atau jalankan terpisah:
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

### 6. Akses Aplikasi
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 Demo Accounts

### Orang Tua
- **Email**: parent@demo.com
- **Password**: password123
- **Fitur**: Dashboard, pembayaran, riwayat transaksi

### Admin
- **Email**: admin@demo.com
- **Password**: password123
- **Fitur**: Dashboard admin, laporan keuangan, manajemen

## 🔄 Flow Pembayaran

1. **Login**: Orang tua login ke sistem
2. **Connect Wallet**: Hubungkan MetaMask ke Polygon network
3. **Pilih Pembayaran**: Pilih tagihan yang akan dibayar
4. **Konfirmasi**: Konfirmasi transaksi di MetaMask
5. **Verifikasi**: Sistem verifikasi transaksi di blockchain
6. **Update Status**: Dashboard terupdate otomatis

## 🛠️ Teknologi yang Digunakan

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- Ethers.js
- Axios
- React Hot Toast
- QR Code Generator
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Ethers.js
- bcryptjs
- CORS

### Blockchain
- Polygon (Matic) Network
- Solidity Smart Contract
- MetaMask Integration
- Web3 Provider

## 📱 Jenis Pembayaran

1. **SPP (Sumbangan Pembinaan Pendidikan)**
   - Pembayaran bulanan rutin
   - Auto-generate setiap bulan

2. **Kegiatan Sekolah**
   - Ekstrakurikuler
   - Study tour
   - Event sekolah

3. **Kantin Digital**
   - Top-up saldo kantin
   - Cashless payment

4. **Donasi**
   - Pembangunan fasilitas
   - Program sekolah

## 🔐 Keamanan

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: bcrypt untuk enkripsi password
- **Blockchain Verification**: Verifikasi transaksi di blockchain
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Validasi data input

## 📊 API Endpoints

### Authentication
- `POST /api/users/login` - Login pengguna
- `POST /api/users/register` - Registrasi pengguna

### Payments
- `POST /api/payments/create` - Buat tagihan baru
- `POST /api/payments/verify` - Verifikasi transaksi blockchain
- `GET /api/payments/pending` - Ambil tagihan pending
- `GET /api/payments/user/:userId` - Riwayat pembayaran user

### Dashboard
- `GET /api/dashboard/:id` - Data dashboard orang tua
- `GET /api/dashboard/admin/overview` - Data dashboard admin

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy build folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to platform
```

### Database (MongoDB Atlas)
- Setup MongoDB Atlas cluster
- Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika ada pertanyaan atau masalah:
- Buat issue di GitHub
- Email: support@schoolpay.com
- Documentation: [Wiki](link-to-wiki)

## 🎯 Roadmap

- [ ] Mobile App (React Native)
- [ ] Multi-language Support
- [ ] Advanced Analytics
- [ ] Bulk Payment Processing
- [ ] Integration dengan Bank
- [ ] Notification System
- [ ] Parent-Teacher Communication

---

**SchoolPay** - Memudahkan pembayaran sekolah dengan teknologi blockchain! 🚀