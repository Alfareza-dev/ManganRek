# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Proyek:** Platform Direktori Kuliner, POS Kasir, & Itinerary Perjalanan Kota Malang

**Target Pengguna Dokumen:** Tim Pengembang SMK Kelas 11 (1 Backend Engineer, 1 Frontend Engineer)

**Versi:** 1.0

---

## 1. Executive Summary & Branding

### Ringkasan Proyek

Proyek ini bertujuan untuk membangun platform digital ekosistem kuliner terintegrasi di Kota Malang. Platform ini menggabungkan fungsi direktori wisata kuliner berbasis lokasi, sistem manajemen restoran (Point of Sale/POS), penjualan voucher digital untuk menggerakkan ekonomi lokal, serta mesin rekomendasi rute perjalanan (*itinerary generator*) cerdas berbasis waktu berkunjung.

### Visi Produk

Menjadi solusi *all-in-one* bagi wisatawan untuk mengeksplorasi kuliner khas Malang secara efisien, sekaligus membantu UMKM kuliner digitalisasi manajemen operasional dan keuangan mereka dalam satu platform terpusat.

### Nama Aplikasi & Filosofi

1. **Mangan Rek**
*Filosofi:* Mangan Rek: Sangat akrab dan bersifat mengajak. "Rek" adalah sapaan universal di Jawa Timur yang memberikan kesan ramah dan terbuka untuk semua orang.

---

## 2. Stakeholder & Functional Requirements

Berikut adalah pemetaan kebutuhan fungsional sistem berdasarkan peran pengguna (*user roles*):

| Role Pengguna | Deskripsi Fitur / Kebutuhan Fungsional |
| --- | --- |
| **Admin Web (Super Admin)** | * Dashboard metrik performa platform (total transaksi global, resto aktif, user aktif).<br>

<br>* Manajemen Master Data (Kategori Kuliner, Wilayah/Kecamatan di Malang).<br>

<br>* Moderasi Konten (Review ulasan user, blokir konten negatif).<br>

<br>* Panel Approval pendaftaran Admin Resto baru (Review berkas legalitas/foto resto). |
| **Admin Resto (Owner)** | * Dashboard ringkasan pendapatan harian, mingguan, bulanan, dan grafik menu terlaris.<br>

<br>* CRUD Manajemen Menu (Foto, Nama, Deskripsi, Harga, Status Ketersediaan).<br>

<br>* Setup Promo Happy Hour (Menentukan jam mulai, jam selesai, dan persentase diskon).<br>

<br>* CRUD Manajemen Voucher Digital (Kuota, masa berlaku, nilai potongan harga).<br>

<br>* Manajemen Akun Staf Kasir (Membuat username dan password khusus kasir). |
| **Kasir Restoran** | * Antarmuka POS (Point of Sale) sederhana untuk input orderan *dine-in/take-away*.<br>

<br>* Modul Validasi & Redeem Kode Voucher Pelanggan (Scan/input kode voucher unik).<br>

<br>* Modul Cetak Struk Belanja (Generasi file PDF siap cetak / Web Print). |
| **User (Wisatawan/Pelanggan)** | * Registrasi instan & login akun.<br>

<br>* Eksplorasi direktori kuliner dilengkapi pencarian, paginasi, dan filter jarak terdekat.<br>

<br>* Pembelian Voucher Digital Restoran terintegrasi dengan Payment Gateway Louvin.<br>

<br>* Fitur *Itinerary Generator*: Input durasi waktu luang (misal: 4 jam) -> Dapatkan rekomendasi rute kunjungan kuliner terdekat secara berurutan.<br>

<br>* Modul Favorit (Bookmark resto pilihan). |

---

## 3. Arsitektur Dokumen Bisnis (Business Flow)

### 3.1. Alur Registrasi & Approval Admin Resto

```
[Pendaftar] -> Input Data Akun & Data Profil Resto secara Bersamaan
                   |
                   v
        [Sistem] Validasi Form (Format Email, Koordinat Lat/Lng, Upload Foto)
                   |
                   v
        [Database] Simpan Data dengan Status Akun: "PENDING"
                   |
                   v
[Admin Resto] Mencoba Login -> [Sistem] Tolak Akses (Pesan: "Menunggu Approval Admin Web")
                   |
                   v
[Admin Web] Masuk ke Panel Approval -> Review Data & Dokumen Resto
                   |
        +----------+----------+
        |                     |
   (Disetujui)            (Ditolak)
        |                     |
        v                     v
[Sistem] Update Status   [Sistem] Hapus Data / Set Status "REJECTED"
menjadi "ACTIVE"              |
        |                     v
        v                [Pendaftar] Notifikasi Penolakan
[Admin Resto] Bisa Login ke Dashboard

```

### 3.2. Alur Pembelian Voucher via Louvin

1. **Checkout:** User memilih voucher di aplikasi, menentukan jumlah, dan klik tombol "Beli".
2. **Hit API Gateway:** Backend menerima request, mengunci kuota sementara, lalu melakukan HTTP POST ke API Louvin dengan membawa payload nominal, ID transaksi internal, dan URL callback.
3. **Invoice Generation:** API Louvin mengembalikan respon berupa `payment_url` (Link invoice).
4. **Redirect User:** Frontend menerima `payment_url` dan menampilkan UI popup/iframe atau redirect agar user menyelesaikan pembayaran di gerbang Louvin.
5. **Webhook Callback:** Setelah pembayaran sukses, server Louvin mengirimkan request POST secara asinkron ke endpoint Webhook Backend aplikasi kita.
6. **State Mutation:** Backend melakukan validasi signature webhook, mengubah status transaksi internal menjadi `PAID`, serta men-generate kode voucher unik acak sepanjang 8 karakter alfanumerik (contoh: `NGLM89XJ`).

### 3.3. Alur Validasi Voucher di Kasir

```
[Pelanggan] Menunjukkan Kode Voucher (e.g., "NGLM89XJ") ke Kasir
                   |
                   v
[Kasir] Input Kode Voucher pada Form POS Kasir -> Klik "Validasi"
                   |
                   v
[Backend] Validasi Kode:
   - Apakah kode voucher ada di DB?
   - Apakah status voucher masih "PAID" (belum terpakai)?
   - Apakah ID Restoran voucher cocok dengan ID Restoran tempat kasir bekerja?
                   |
        +----------+----------+
        | (Valid)             | (Tidak Valid)
        |                     v
        v                [Sistem] Tampilkan Pesan Error / Akses Ditolak
[Backend] Kalkulasi: Potong total belanja POS dengan nilai nominal voucher
        |
        v
[Backend] Update status voucher dari "PAID" menjadi "USED" (Terpakai)
        |
        v
[Sistem POS] Tampilkan Total Bayar Baru -> Kasir Selesaikan Transaksi -> Cetak Struk

```

### 3.4. Alur Rekomendasi Rute Kuliner (Itinerary Generator)

1. **Input Parameter:** User memasukkan koordinat awal (GPS saat ini), koordinat akhir (misal: stasiun/hotel), dan total durasi waktu yang dimiliki dalam satuan jam (misal: $T_{total} = 5$ jam).
2. **Fetch Candidates:** Sistem mencari semua restoran aktif yang berada dalam batas bounding box radius maksimum dari lokasi awal user.
3. **Filtering Rute & Jarak:** Menggunakan formula geografis, sistem mengurutkan destinasi kuliner yang searah atau terdekat membentuk lintasan terpendek dari titik awal ke titik akhir.
4. **Kalkulasi Alokasi Waktu:**
* Setiap titik kunjungan diberikan asumsi waktu makan tetap selama 1 jam.
* Waktu perjalanan antar titik dihitung menggunakan rata-rata kecepatan perkotaan atau estimasi *Distance Matrix*.


5. **Looping Pembatasan Waktu:** Sistem memasukkan restoran ke dalam list rencana perjalanan selama total durasi waktu perjalanan ditambah waktu makan tidak melebihi nilai $T_{total}$.
6. **Output:** Menampilkan urutan lokasi kunjungan kuliner terstruktur di peta lengkap dengan estimasi jam tiba, jam selesai makan, dan menu rekomendasi.

### 3.5. Alur Otomatisasi Promo Berbasis Jam (Pseudocode)

Mekanisme penandaan badge "Promo Aktif" dilakukan secara dinamis pada saat pengambilan data (*query runtime*), memastikan badge berubah secara *real-time* mengikuti perubahan jam server tanpa memerlukan cron-job yang berat.

```python
FUNCTION get_restaurant_list_with_promo_status(user_lat, user_lng):
    current_time = GET_CURRENT_SERVER_TIME() # Ambil HH:MM:SS saat ini
    
    # Query database restoran terdekat
    restaurants = QUERY "SELECT id, name, latitude, longitude FROM Restaurants"
    
    FOR EACH resto IN restaurants:
        # Hitung jarak lokasi dengan formula Haversine
        resto.distance = calculate_haversine(user_lat, user_lng, resto.latitude, resto.longitude)
        
        # Ambil data aturan promo restoran bersangkutan
        promo = QUERY "SELECT discount_percent, start_hour, end_hour FROM Promos WHERE restaurant_id = resto.id LIMIT 1"
        
        IF promo EXISTS THEN:
            # Periksa apakah jam saat ini berada di dalam jendela waktu promo
            IF current_time >= promo.start_hour AND current_time <= promo.end_hour THEN:
                resto.is_promo_active = TRUE
                resto.discount_display = promo.discount_percent
            ELSE:
                resto.is_promo_active = FALSE
                resto.discount_display = 0
            ENDIF
        ELSE:
            resto.is_promo_active = FALSE
            resto.discount_display = 0
        ENDIF
    ENDFOR
    
    RETURN restaurants

```

---

## 4. Spesifikasi Teknis Backend (NestJS & Prisma)

### 4.1. Struktur Modul NestJS

Aplikasi backend menggunakan pendekatan *Modular Architecture* bawaan NestJS untuk memisahkan domain bisnis secara rapi dan mandiri:

```
src/
├── app.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.controller.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.controller.ts
├── restaurants/
│   ├── restaurants.module.ts
│   ├── restaurants.service.ts
│   └── restaurants.controller.ts
├── vouchers/
│   ├── vouchers.module.ts
│   ├── vouchers.service.ts
│   └── vouchers.controller.ts
├── pos/
│   ├── pos.module.ts
│   ├── pos.service.ts
│   └── pos.controller.ts
└── itinerary/
    ├── itinerary.module.ts
    ├── itinerary.service.ts
    └── itinerary.controller.ts

```

### 4.2. Skema Database (Prisma ORM Text-Based ERD)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ADMIN_RESTO
  KASIR
  USER
}

enum AccountStatus {
  PENDING
  ACTIVE
  REJECTED
}

enum VoucherStatus {
  PAID
  USED
}

model User {
  id            String        @id @default(uuid())
  email         String        @unique
  password      String
  name          String
  role          Role          @default(user)
  status        AccountStatus @default(ACTIVE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relations
  restaurant    Restaurant?   // One-to-One: Jika dia Admin Resto
  managedResto  Restaurant?   @relation("CashierResto", fields: [managedRestoId], references: [id])
  managedRestoId String?
  transactions  Transaction[] // One-to-Many: Transaksi pembelian voucher oleh user
}

model Restaurant {
  id           String        @id @default(uuid())
  name         String
  address      String
  latitude     Float
  longitude    Float
  legalPhoto   String
  ownerId      String        @unique
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  // Relations
  owner        User          @relation(fields: [ownerId], references: [id])
  cashiers     User[]        @relation("CashierResto")
  menus        Menu[]
  promos       Promo[]
  vouchers     Voucher[]
}

model Menu {
  id           String     @id @default(uuid())
  restaurantId String
  name         String
  description  String
  price        Float
  image        String
  isAvailable  Boolean    @default(true)
  createdAt    DateTime   @default(now())
  
  // Relations
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
}

model Promo {
  id           String     @id @default(uuid())
  restaurantId String
  discount     Int        // Persentase diskon, e.g. 15 untuk 15%
  startHour    String     // Format HH:MM (e.g., "14:00")
  endHour      String     // Format HH:MM (e.g., "17:00")
  
  // Relations
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
}

model Voucher {
  id           String        @id @default(uuid())
  restaurantId String
  title        String
  price        Float         // Harga beli voucher
  value        Float         // Nilai potongan belanja voucher di kasir
  expiryDate   DateTime
  createdAt    DateTime      @default(now())
  
  // Relations
  restaurant   Restaurant    @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

model Transaction {
  id            String        @id @default(uuid())
  userId        String
  voucherId     String
  uniqueCode    String?       @unique // Generate setelah status PAID, e.g. NGLM89XJ
  status        VoucherStatus @default(PAID)
  totalPaid     Float
  paymentUrl    String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relations
  user          User          @relation(fields: [userId], references: [id])
  voucher       Voucher       @relation(fields: [voucherId], references: [id])
}

```

### 4.3. Daftar API Endpoints

| Method | Path URL | Deskripsi | Query Params | Guard Role |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register/user` | Registrasi instan pengguna umum | - | `Public` |
| `POST` | `/api/auth/register/resto` | Registrasi multi-entity Admin + Profil Resto | - | `Public` |
| `POST` | `/api/auth/login` | Login user, mengembalikan HttpOnly Cookie JWT | - | `Public` |
| `GET` | `/api/admin/approvals` | List permohonan pendaftaran resto status PENDING | `page`, `limit` | `SUPER_ADMIN` |
| `PATCH` | `/api/admin/approvals/:id` | Mengubah status registrasi resto (Approve/Reject) | - | `SUPER_ADMIN` |
| `GET` | `/api/restaurants` | Direktori resto dengan filter spasial & paginasi | `page`, `limit`, `lat`, `lng`, `sort` | `Public` |
| `POST` | `/api/vouchers/buy` | Inisialisasi transaksi pembelian voucher Louvin | - | `USER` |
| `POST` | `/api/vouchers/webhook` | Endpoint callback notifikasi Louvin Payment Gateway | - | `Public` |
| `POST` | `/api/pos/validate` | Validasi & potong transaksi lewat kode voucher unik | - | `KASIR` |
| `GET` | `/api/itinerary` | Generate rute kuliner cerdas berbasis durasi waktu | `startLat`, `startLng`, `endLat`, `endLng`, `duration` | `USER` |

#### Contoh JSON Request & Response

##### 1. POST `/api/auth/register/resto` (Multi-Entity Register)

*Request Body:*

```json
{
  "email": "bakso.mercon@gmail.com",
  "password": "SecretPassword123",
  "name": "Budi Santoso",
  "restaurantName": "Bakso Mercon Malang",
  "address": "Jl. Soekarno-Hatta No. 12, Kota Malang",
  "latitude": -7.942134,
  "longitude": 112.620345,
  "legalPhoto": "https://supabase-storage.com/legal/bukti-resto.jpg"
}

```

*Response (211 Created):*

```json
{
  "success": true,
  "message": "Registrasi multi-entity berhasil diajukan. Akun berstatus PENDING menunggu verifikasi administrator.",
  "data": {
    "userId": "d3b07384-d113-4c5c-a55e-123456789ab",
    "restaurantId": "e1a90823-c214-4a1b-b22c-987654321xy",
    "status": "PENDING"
  }
}

```

##### 2. GET `/api/restaurants?page=1&limit=10&lat=-7.966620&lng=112.632632&sort=terdekat`

*Response (200 OK):*
*(Catatan: Menggunakan kalkulasi rumus kedekatan spasial Haversine di sisi database query)*

```json
{
  "success": true,
  "meta": {
    "currentPage": 1,
    "limit": 10,
    "totalData": 45
  },
  "data": [
    {
      "id": "e1a90823-c214-4a1b-b22c-987654321xy",
      "name": "Bakso Mercon Malang",
      "address": "Jl. Soekarno-Hatta No. 12, Kota Malang",
      "distanceKm": 2.84,
      "isPromoActive": true,
      "discountDisplay": 15,
      "menus": [
        { "name": "Bakso Granat Super", "price": 25000 }
      ]
    }
  ]
}

```

##### 3. POST `/api/vouchers/buy` (Checkout Voucher)

*Request Body:*

```json
{
  "voucherId": "v1b2c3d4-e5f6-7a8b-9c0d-112233445566"
}

```

*Response (200 OK - Integrasi Louvin Link):*

```json
{
  "success": true,
  "message": "Invoice transaksi berhasil dibuat.",
  "data": {
    "transactionId": "t9r8e7w6-q5a4-s3d2-f1g0-998877665544",
    "paymentUrl": "https://api.louvin.id/v1/invoice/checkout/3321908aa112"
  }
}

```

---

## 5. Spesifikasi Teknis Frontend (Next.js)

### 5.1. Arsitektur Direktori Next.js (App Router)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Landing Page & Fitur Cari Direktori)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   ├── user/
│   │   │   └── page.tsx
│   │   └── resto/
│   │       └── page.tsx
│   ├── dashboard/ (Protected Layout Shared)
│   │   ├── admin-web/
│   │   │   └── page.tsx (Panel Approval Resto)
│   │   ├── admin-resto/
│   │   │   ├── page.tsx (Menu & Promo Setup)
│   │   │   └── cashiers/
│   │   │       └── page.tsx
│   │   └── kasir/
│   │       └── page.tsx (Sistem POS & Validasi Voucher)
│   ├── itinerary/
│   │   └── page.tsx (Peta Rute Cerdas Kuliner)
│   └── vouchers/
│       └── page.tsx (Katalog Voucher User)
├── components/
│   ├── ui/ (Button, Input, Card re-usable)
│   ├── Navbar.tsx
│   └── MapView.tsx (Peta Interaktif)
├── middleware.ts (Protected Routes Mechanism)
└── store/
    └── useAuthStore.ts (State Management via Zustand)

```

### 5.2. Skema Protected Routes Menggunakan Middleware

Sistem otentikasi memanfaatkan mekanisme *Token Verification* di dalam file `src/middleware.ts` untuk membaca payload role dari HttpOnly Cookie JWT guna mengamankan halaman dashboard per kelompok hak akses.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Ringan dan kompatibel di lingkungan Edge Runtime

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Jika mencoba mengakses area dashboard tanpa token, lempar ke login
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      // Decode token secara aman di sisi Edge
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;
      const userStatus = payload.status as string;

      // Proteksi Status Akun PENDING untuk Admin Resto
      if (userRole === 'ADMIN_RESTO' && userStatus === 'PENDING') {
        if (pathname !== '/login') {
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('auth_token'); // Bersihkan token penyusup
          return response;
        }
      }

      // Validasi Batasan Role Terhadap Path Halaman
      if (pathname.startsWith('/dashboard/admin-web') && userRole !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (pathname.startsWith('/dashboard/admin-resto') && userRole !== 'ADMIN_RESTO') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (pathname.startsWith('/dashboard/kasir') && userRole !== 'KASIR') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    } catch (error) {
      // Jika token expired/invalid, hapus dan redirect ke halaman login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/vouchers/:path*', '/itinerary/:path*'],
};

```

### 5.3. Manajemen State (Zustand Store)

Zustand digunakan untuk mengelola keranjang belanja sistem POS Kasir secara ringan di sisi klien.

```typescript
import { create } from 'zustand';

interface CartItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
}

interface PosState {
  cart: CartItem[];
  voucherDiscount: number;
  appliedVoucherCode: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  applyVoucher: (code: string, value: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  voucherDiscount: 0,
  appliedVoucherCode: null,
  addToCart: (newItem) => set((state) => {
    const existingIndex = state.cart.findIndex((i) => i.menuId === newItem.menuId);
    if (existingIndex > -1) {
      const updatedCart = [...state.cart];
      updatedCart[existingIndex].quantity += 1;
      return { cart: updatedCart };
    }
    return { cart: [...state.cart, { ...newItem, quantity: 1 }] };
  }),
  applyVoucher: (code, value) => set({ appliedVoucherCode: code, voucherDiscount: value }),
  clearCart: () => set({ cart: [], voucherDiscount: 0, appliedVoucherCode: null }),
  getTotalPrice: () => {
    const subtotal = get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal - get().voucherDiscount;
    return finalTotal < 0 ? 0 : finalTotal;
  }
}));

```

### 5.4. Integrasi Peta & Eksekusi Pembayaran Louvin

* **Google Maps API / Leaflet (Free Alternatif):** Frontend menggunakan pustaka `@react-google-maps/api` atau `react-leaflet` pada komponen `MapView.tsx`. Komponen menerima array berisi titik koordinat latitude dan longitude milik restoran dari REST API, kemudian menampilkannya dalam bentuk penanda (*marker*). Ketika marker diklik, komponen memunculkan jendela info (*infowindow*) berisi nama restoran dan tombol arahkan rute.
* **Handling Transaksi Pembayaran Louvin:** Pada saat tombol checkout ditekan, Frontend memicu fungsi asinkron untuk memanggil endpoint `/api/vouchers/buy`. Begitu `payment_url` diterima dalam bentuk respon data, aplikasi akan membuka tautan tersebut dalam bentuk modal *Iframe Overlay* terintegrasi atau mengalihkan (*redirect*) halaman window browser saat itu. Komponen juga memasang deteksi *event listener listener/polling interval* berkala untuk mengecek ke server backend apakah status transaksi sudah berubah menjadi `PAID` agar dapat menutup modal otomatis dan menampilkan layar sukses konfirmasi kode voucher baru.

---

## 6. Mapping Kriteria Penilaian Sekolah

Tabel di bawah ini memetakan seluruh parameter penilaian proyek akhir SMK Jurusan RPL agar terpenuhi di dalam fitur aplikasi:

| Sektor Penilaian | Parameter Kompetensi | Fitur Implementasi Riil Pada Aplikasi |
| --- | --- | --- |
| **Inisialisasi Proyek** | Arsitektur berkas & konfigurasi dasar | Penataan struktur modul NestJS secara modular dan manajemen folder App Router Next.js dengan pemisahan komponen UI yang bersih. |
| **Backend & Database** | Operasi CRUD Relasional Komprehensif | Pembuatan fitur manajemen menu makanan, kategori kuliner, dan pengelolaan akun staf kasir oleh pemilik restoran menggunakan Prisma Client. |
| **Backend & Database** | Transaksi & Keamanan Kompleks | Implementasi pencatatan transaksi pembelian voucher dengan penguncian status relasional serta penggunaan bcrypt untuk proteksi enkripsi password data. |
| **Frontend UI/UX** | Slicing Layout & Aspek Responsif | Pembuatan dashboard admin, antar muka POS kasir, serta halaman direktori penjelajah kuliner yang adaptif diakses lewat ponsel menggunakan Tailwind CSS. |
| **Frontend UI/UX** | Interaktivitas & State Management | Manajemen cart belanja POS kasir dan state reduksi harga secara *real-time* via Zustand tanpa reload halaman web. |
| **Integrasi Sistem** | Konsumsi REST API & Keamanan | Proses komunikasi data menggunakan Fetch API/Axios dilengkapi proteksi otentikasi token yang disimpan aman di dalam HttpOnly Cookie. |
| **Integrasi Eksternal** | Koneksi Pihak Ketiga (Third-Party) | Penerimaan data asinkron via Webhook Louvin Payment Gateway serta visualisasi data geospasial titik lokasi restoran memanfaatkan Google Maps API. |

---

## 7. Manajemen Proyek (Timeline, Risiko & Mitigasi)

### 7.1. Timeline Pengerjaan (Durasi 6 Minggu, Tim 2 Orang)

```
[Minggu 1: Fondasi & DB] ======= (BE: Inisialisasi NestJS, Prisma DB Setup, Skema ERD)
                         ======= (FE: Setup Next.js, Tema Tailwind, Struktur Folder App)
[Minggu 2: Auth & Resto]   ======= (BE: API Multi-Entity Auth, JWT, Registrasi Form Flow)
                           ======= (FE: Slicing Login, Registrasi Cabang User & Resto PENDING)
[Minggu 3: Direktori & POS]  ======= (BE: API Get Resto Jarak Haversine, CRUD Menu, Setup Promo)
                             ======= (FE: Integrasi Maps API, Katalog Resto, Infinite Scroll)
[Minggu 4: Transaksi & POS]    ======= (BE: Integrasi API Louvin, Modul Validasi Voucher Kasir)
                               ======= (FE: Dashboard Kasir POS, Integrasi Keranjang Belanja Zustand)
[Minggu 5: Rute Itinerary]       ======= (BE: Algoritma Rute Generator Berbasis Jam Kunjungan)
                                 ======= (FE: Layout Halaman Itinerary & Visualisasi Jalur Peta)
[Minggu 6: Pengujian & Bug]        ======= (BE & FE: Testing Webhook Integration, Bugfixing, Deploy)

```

### 7.2. Analisis Risiko Teknis & Mitigasi

1. **Risiko 1: Kegagalan Callback Webhook Louvin**
*Dampak:* User sudah membayar di sistem Louvin, namun status voucher di aplikasi kita tetap tertera sebagai `PENDING` karena paket data webhook terputus di tengah jalan.
*Mitigasi:* Backend tidak boleh hanya bergantung secara pasif pada kiriman data Webhook. Buat satu fungsi sinkronisasi berupa *cron job* terjadwal atau sediakan tombol manual "Cek Status Pembayaran" di sisi Frontend User. Ketika tombol diklik, backend akan melakukan panggilan balik (*polling request*) langsung ke API pengecekan transaksi milik Louvin secara *real-time* untuk memastikan status transaksi yang valid.
2. **Risiko 2: Kueri Kalkulasi Lokasi Jarak Terdekat yang Berat**
*Dampak:* Operasi rumus matematika trigonometri rumus Haversine secara mentah langsung di dalam relasi tabel PostgreSQL dapat mengakibatkan waktu muat halaman (*latency kueri*) membengkak seiring bertambahnya ratusan baris data restoran.
*Mitigasi:* Manfaatkan ekstensi **PostGIS** bawaan di Supabase PostgreSQL. Simpan kolom koordinat lokasi restoran ke dalam tipe data khusus geospasial `GEOMETRY(Point, 4326)` dan buat indeks spasial (*Spatial Indexing GIST*). Dengan metode ini, kalkulasi pencarian radius restoran terdekat dapat dieksekusi dalam hitungan milidetik karena dihitung di level indeks memori database, bukan melalui komputasi manual per baris tabel.