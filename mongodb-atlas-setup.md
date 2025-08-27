# MongoDB Atlas Setup (Cloud Database)

## Langkah-langkah:

1. **Daftar MongoDB Atlas**
   - Kunjungi: https://www.mongodb.com/atlas
   - Klik "Try Free"
   - Daftar dengan email Anda

2. **Buat Cluster**
   - Pilih "Build a Database"
   - Pilih "M0 Sandbox" (FREE)
   - Pilih region terdekat (Singapore/Jakarta)
   - Klik "Create Cluster"

3. **Setup Database Access**
   - Klik "Database Access" di sidebar
   - Klik "Add New Database User"
   - Username: `schoolpay`
   - Password: `schoolpay123` (atau password yang aman)
   - Database User Privileges: "Read and write to any database"
   - Klik "Add User"

4. **Setup Network Access**
   - Klik "Network Access" di sidebar
   - Klik "Add IP Address"
   - Pilih "Allow Access from Anywhere" (0.0.0.0/0)
   - Klik "Confirm"

5. **Dapatkan Connection String**
   - Klik "Database" di sidebar
   - Klik "Connect" pada cluster Anda
   - Pilih "Connect your application"
   - Copy connection string
   - Contoh: `mongodb+srv://schoolpay:schoolpay123@cluster0.xxxxx.mongodb.net/school_payment?retryWrites=true&w=majority`

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://schoolpay:schoolpay123@cluster0.xxxxx.mongodb.net/school_payment?retryWrites=true&w=majority
   ```

## Keuntungan MongoDB Atlas:
- ✅ Gratis untuk development
- ✅ Tidak perlu install MongoDB local
- ✅ Backup otomatis
- ✅ Monitoring built-in
- ✅ Akses dari mana saja