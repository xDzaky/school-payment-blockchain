# 💰 Alur Dana SchoolPay - Sistem Pembayaran Blockchain

## 🔄 Bagaimana Uang Mengalir dalam Sistem

### 1. **Orang Tua Melakukan Pembayaran**
```
Orang Tua → MetaMask Wallet → Blockchain Polygon → Wallet Sekolah
```

**Detail Proses:**
- Orang tua login dan pilih tagihan
- Connect MetaMask wallet
- Sistem convert IDR ke MATIC (1 MATIC ≈ Rp 10,000)
- Transaksi dikirim ke wallet sekolah: `0x8ba1f109551bD432803012645Hac136c5C1fD4E5`
- Hash transaksi disimpan di database

### 2. **Dana Terkumpul di Wallet Sekolah**

**Alamat Wallet Sekolah:**
```
0x8ba1f109551bD432803012645Hac136c5C1fD4E5
```

**Cara Mengakses:**
- Import private key ke MetaMask
- Network: Polygon Mumbai Testnet
- Semua MATIC dari pembayaran terkumpul di sini

### 3. **Admin Bisa Monitor & Tarik Dana**

**Dashboard Admin menampilkan:**
- Total dana terkumpul (IDR + MATIC)
- Riwayat transaksi dengan hash blockchain
- Link ke PolygonScan untuk verifikasi
- Tombol "Cek Saldo Wallet" real-time

## 🏦 Cara Admin Mengakses Dana

### Opsi 1: Import ke MetaMask
```bash
1. Buka MetaMask
2. Import Account → Private Key
3. Masukkan: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
4. Switch ke Polygon Mumbai Testnet
5. Dana MATIC akan terlihat
```

### Opsi 2: Transfer ke Exchange
```bash
1. Dari wallet sekolah → Transfer ke Binance/Indodax
2. Convert MATIC → IDR
3. Withdraw ke rekening bank sekolah
```

### Opsi 3: P2P Trading
```bash
1. Jual MATIC langsung ke buyer
2. Terima pembayaran bank transfer
3. Transfer MATIC dari wallet sekolah
```

## 📊 Tracking & Transparansi

### Database Records
Setiap pembayaran tersimpan dengan:
- `transactionHash`: Hash blockchain
- `blockchainAmount`: Jumlah MATIC
- `schoolWallet`: Alamat tujuan
- `blockchainConfirmed`: Status verifikasi

### Blockchain Explorer
Semua transaksi bisa dicek di:
```
https://mumbai.polygonscan.com/address/0x8ba1f109551bD432803012645Hac136c5C1fD4E5
```

## 💡 Keuntungan Sistem Blockchain

### ✅ Transparansi
- Semua transaksi tercatat di blockchain
- Tidak bisa dimanipulasi atau dihapus
- Orang tua bisa verifikasi sendiri

### ✅ Keamanan
- Private key hanya admin yang tahu
- Multi-signature bisa ditambahkan
- Tidak ada single point of failure

### ✅ Efisiensi
- Biaya transaksi rendah (~$0.01)
- Transfer instan 24/7
- Tidak perlu bank sebagai perantara

### ✅ Global Access
- Bisa diakses dari mana saja
- Tidak terbatas jam operasional bank
- Support multi-currency

## 🔐 Keamanan Wallet Sekolah

### Private Key Management
```env
SCHOOL_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**⚠️ PENTING:**
- Simpan private key di tempat aman
- Jangan share ke orang lain
- Backup di multiple lokasi
- Pertimbangkan hardware wallet untuk produksi

### Multi-Signature (Recommended)
Untuk keamanan ekstra, gunakan multi-sig wallet:
- Butuh 2-3 tanda tangan untuk transfer
- Kepala sekolah + Bendahara + Komite
- Mencegah penyalahgunaan dana

## 📈 Contoh Perhitungan Dana

### Skenario: 100 Siswa Bayar SPP
```
SPP per siswa: Rp 500,000
Total: Rp 50,000,000

Konversi ke MATIC (1 MATIC = Rp 10,000):
50,000,000 ÷ 10,000 = 5,000 MATIC

Dana terkumpul di wallet sekolah: 5,000 MATIC
```

### Penarikan Dana
```
Opsi 1: Jual di exchange
5,000 MATIC × Rp 10,000 = Rp 50,000,000

Opsi 2: Hold untuk investasi
MATIC bisa naik/turun, potensi profit/loss
```

## 🛠️ Tools untuk Admin

### 1. PolygonScan
- Cek saldo real-time
- History transaksi
- Verifikasi pembayaran

### 2. MetaMask
- Akses wallet sekolah
- Transfer dana
- Interact dengan DeFi

### 3. Dashboard Admin
- Monitor pembayaran
- Export laporan
- Analisis keuangan

## 🚀 Upgrade Future

### Smart Contract Features
- Auto-distribute ke multiple wallet
- Staking rewards untuk dana idle
- Automated accounting
- Tax calculation

### Integration
- Bank API untuk auto-convert
- Accounting software sync
- Mobile app untuk orang tua
- WhatsApp notifications

---

**💡 Kesimpulan:**
Dana dari orang tua mengalir langsung ke wallet sekolah melalui blockchain. Admin punya kontrol penuh untuk monitor dan tarik dana kapan saja. Sistem ini lebih transparan dan efisien dibanding metode tradisional.