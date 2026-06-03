# Mangan Rek! - Backend API 

**Mangan Rek!** adalah platform direktori kuliner modern yang dirancang khusus untuk menjelajahi, merencanakan perjalanan kuliner, serta mengelola promosi kuliner bersejarah di Kota Malang. Repositori ini berisi **Backend API** yang melayani aplikasi antarmuka pengguna (Frontend), dibangun dengan performa tinggi menggunakan NestJS, Prisma ORM, dan PostgreSQL.

---

## 🚀 Fitur Utama (Backend)

API ini melayani berbagai fungsi yang terbagi dalam beberapa sisi pengguna:

### 1. 🧑‍💻 Sisi Pengguna (User / Wisatawan)
* **Autentikasi:** Registrasi, login, dan manajemen profil wisatawan.
* **Eksplorasi Kuliner:** Endpoint untuk mengambil daftar restoran, detail restoran, dan lokasi kuliner di Malang.
* **Rencana Perjalanan (Itinerary):** CRUD (Create, Read, Update, Delete) untuk rencana kunjungan kuliner terorganisir.
* **Promo & Voucher:** Endpoint untuk klaim dan penggunaan voucher/promo restoran.
* **Kirim Pesan:** Endpoint form kontak interaktif untuk memberikan feedback.

### 2. 🏢 Sisi Pemilik Restoran (Admin Resto)
* **Manajemen Restoran:** Memperbarui data restoran, jam buka, dan fasilitas.
* **Manajemen Menu:** CRUD untuk kategori menu dan item menu beserta unggahan foto melalui **Cloudinary**.
* **Manajemen Promo & Voucher:** Pembuatan dan pengelolaan voucher potongan harga/diskon.
* **Laporan Penjualan:** Agregasi data penjualan dan laporan transaksi untuk dashboard owner.

### 3. 👥 Sisi Kasir (Cashier Dashboard / POS)
* **Transaksi Kasir (POS):** Pembuatan pesanan baru (order) dan pencatatan pembayaran (transaction).
* **Riwayat Pesanan:** Endpoint untuk memantau transaksi harian.

### 4. 🔑 Sisi Administrator Sistem (Admin Web)
* **Manajemen Persetujuan (Approvals):** Endpoint untuk memvalidasi pendaftaran restoran baru.
* **Manajemen Pengguna & Pemilik:** CRUD dan pemantauan semua akun di dalam sistem.
* **Pesan Masuk (Contacts):** Membaca dan membalas pesan masuk dari pengguna.

---

## 🛠️ Stack Teknologi

Proyek backend ini dibangun menggunakan teknologi modern berikut:

* **Framework Utama:** [NestJS 11](https://nestjs.com/)
* **ORM & Database:** [Prisma ORM](https://www.prisma.io/) & PostgreSQL
* **Autentikasi & Keamanan:** [Passport.js](https://www.passportjs.org/) (JWT Strategy) & Bcrypt
* **Dokumentasi API:** [Swagger UI](https://swagger.io/tools/swagger-ui/) (@nestjs/swagger)
* **Penyimpanan Berkas (Uploads):** [Cloudinary](https://cloudinary.com/) & Multer
* **Bahasa Pemrograman:** TypeScript

---

## ⚙️ Cara Menjalankan Project Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan Backend API di lingkungan lokal Anda:

### 1. Clone Repositori & Instal Dependensi
Pastikan Anda sudah menginstal **Node.js** di perangkat Anda, kemudian jalankan perintah berikut:
```bash
# Masuk ke direktori backend
cd BE

# Instal seluruh package dependensi
npm install
```

### 2. Konfigurasi Environment (Variabel Lingkungan)
Buat file `.env` di dalam direktori `BE` dan isi dengan konfigurasi berikut (sesuaikan dengan nilai Anda):
```env
# Contoh konfigurasi koneksi database PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/manganrek?schema=public"

# Konfigurasi JWT Secret untuk autentikasi
JWT_SECRET="rahasia_jwt_super_aman"

# Konfigurasi Cloudinary untuk upload gambar
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Migrasi Database (Prisma)
Generate Prisma Client dan sinkronisasi skema database ke PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```
*(Gunakan `npx prisma migrate dev` jika Anda ingin membuat riwayat migrasi)*

### 4. Jalankan Mode Development
Jalankan server backend:
```bash
npm run start:dev
```
Setelah berhasil berjalan, API dapat diakses melalui `http://localhost:3000`.

### 5. Dokumentasi API (Swagger)
Dokumentasi interaktif OpenAPI/Swagger tersedia saat aplikasi berjalan secara lokal. Buka di browser:
👉 [http://localhost:3000/api](http://localhost:3000/api)

---

## 📂 Struktur Folder Utama
```text
BE/
├── prisma/               # Skema Prisma & Migrasi Database
├── src/
│   ├── admin/            # Modul fitur Administrator Sistem
│   ├── auth/             # Modul Autentikasi dan Otorisasi (JWT)
│   ├── cloudinary/       # Layanan untuk Upload Gambar
│   ├── contacts/         # Modul Pesan/Kontak dari Pengguna
│   ├── itinerary/        # Modul Perencanaan Perjalanan Kuliner
│   ├── pos/              # Modul Point of Sales (Kasir) & Pesanan
│   ├── prisma/           # Konfigurasi Database Prisma Service
│   ├── restaurants/      # Modul Manajemen Restoran & Menu
│   ├── users/            # Modul Profil dan Pengguna Umum
│   ├── vouchers/         # Modul Promo dan Voucher
│   └── main.ts           # Entry point aplikasi NestJS & Konfigurasi Swagger
├── package.json          # File konfigurasi dependensi & npm scripts
└── README.md             # Dokumentasi Backend
```

---
*Dibuat dengan sungguh-sungguh untuk melestarikan Warisan Kuliner Khas Kota Malang.*
