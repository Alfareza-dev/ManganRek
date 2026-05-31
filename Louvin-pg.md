Louvin API Documentation
Louvin API memungkinkan Anda menerima pembayaran digital (QRIS, GoPay, ShopeePay, Virtual Account) tanpa memerlukan identitas bisnis. Semua request menggunakan JSON melalui HTTPS.

Base URL: https://api.louvin.dev

Version: v1.0

Overview
Quick Start
SDK
Authentication
Fees
Create Transaction
Check Status
Payment Types
Status Flow
Webhooks
Error Handling
Subscription
Overview
Endpoints	3 — create-transaction, check-status, create-subscription
Auth	API Key via header x-api-key
Format	JSON (Request & Response)
Quick Start
Buat Project di Dashboard — Masuk ke Dashboard → Proyek → Buat Proyek. Anda akan mendapat API key yang dimulai dengan lv_.
Buat Transaksi
const res = await fetch("https://api.louvin.dev/create-transaction", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "lv_your_api_key_here"
  },
  body: JSON.stringify({
    amount: 50000,
    payment_type: "qris",
    customer_name: "John Doe"
  })
});

const data = await res.json();
// data.payment.qr_string → tampilkan sebagai QR code
// data.payment.va_number → tampilkan nomor VA ke customer
Terima Notifikasi — Set Webhook URL di pengaturan proyek. Louvin akan kirim HTTP POST setiap kali status transaksi berubah.
Louvin SDK
SDK JavaScript ringan untuk integrasi cepat. Tanpa dependency, bekerja di browser dan Node.js.

Instalasi
<!-- CDN -->
<script src="https://louvin.dev/sdk/louvin.min.js"></script>

<!-- ES Module -->
<script type="module">
  import { Louvin } from 'https://louvin.dev/sdk/louvin.js';
</script>
Buat Pembayaran
const louvin = new Louvin('lv_your_api_key');

const result = await louvin.createPayment({
  amount: 50000,
  payment_type: 'qris',
  customer_name: 'John Doe',
  description: 'Order #123'
});

console.log(result.payment.qr_string);
console.log(result.transaction.id);
Shortcut Methods
await louvin.createQRIS(50000, { customer_name: 'John' });
await louvin.createBNI(100000);
await louvin.createBRI(100000);
await louvin.createPermata(100000);
await louvin.createCIMB(100000);
Subscription
const sub = await louvin.createSubscription({
  plan_id: 'plan-uuid-from-dashboard',
  customer_email: 'customer@example.com',
  customer_name: 'John Doe'
});
console.log(sub.subscription.id);
Cek Status & Polling
const status = await louvin.checkStatus('transaction-uuid');
console.log(status.transaction.status); // 'pending' | 'settled' | 'failed'

const final = await louvin.waitForPayment('transaction-uuid', {
  interval: 3000,
  timeout: 600000,
  onStatusChange: (data) => console.log('Status:', data.transaction.status)
});
Authentication
Setiap request harus menyertakan API key di header. API key didapat dari Dashboard → Proyek → Detail Proyek.

Header	Value
Content-Type	application/json
x-api-key	API key proyek Anda (dimulai dengan lv_)
curl -X POST https://api.louvin.dev/create-transaction \
  -H "Content-Type: application/json" \
  -H "x-api-key: lv_your_api_key_here" \
  -d '{"amount": 50000, "payment_type": "qris"}'
⚠️ Jangan expose API key di client-side production. Gunakan backend proxy.
Biaya Transaksi
Fee dihitung otomatis. Tidak ada biaya bulanan atau biaya setup.

Metode	Fee	Keterangan
QRIS / E-Wallet	0.7% + Rp 400	Min transaksi Rp 1.500
Virtual Account	Rp 6.500	Flat fee per transaksi
Contoh Perhitungan
Contoh	Amount	Fee	Customer Bayar	Merchant Terima
QRIS Rp 50.000	50.000	750	50.750	50.000
BNI VA Rp 100.000	100.000	6.500	106.500	100.000
Jika fee_on_customer aktif (default), fee ditambahkan ke total yang dibayar customer. Merchant menerima penuh net_amount.

Create Transaction
POST /create-transaction

Request Body
Parameter	Type	Required	Description
amount	number	✅	Jumlah pembayaran dalam Rupiah (min: 1, QRIS min: 1500)
payment_type	string	✅	Metode pembayaran (lihat Payment Types)
customer_name	string		Nama pelanggan
customer_email	string		Email pelanggan
description	string		Deskripsi transaksi
reference	string		ID referensi unik (auto-generated jika kosong)
source_url	string		URL website asal transaksi (mis. https://tokokamu.com). Otomatis terisi jika pakai SDK dari browser. Server-to-server caller wajib kirim manual agar transaksi tercatat di dashboard "Website".
Tip Tracking: Kirim source_url di body request untuk melacak website mana yang membuat transaksi. Field ini muncul di halaman Transaksi & Website pada dashboard.
Contoh Request
const response = await fetch("https://api.louvin.dev/create-transaction", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "lv_your_api_key_here"
  },
  body: JSON.stringify({
    amount: 50000,
    payment_type: "qris",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    description: "Pembelian Produk A"
  })
});

const data = await response.json();
Response — QRIS (201 Created)
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 50750,
    "fee": 750,
    "net_amount": 50000,
    "status": "pending",
    "reference": "550e8400-1711234567890-a1b2c3",
    "fee_on_customer": true,
    "created_at": "2026-03-09T10:30:00Z"
  },
  "payment": {
    "order_id": "550e8400-1711234567890-a1b2c3",
    "payment_type": "qris",
    "qr_string": "00020101021226...",
    "payment_number": "00020101021226...",
    "expired_at": "2026-03-09T10:45:00Z",
    "total_payment": 50750
  }
}
Response — Virtual Account
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 106500,
    "fee": 6500,
    "net_amount": 100000,
    "status": "pending",
    "reference": "550e8400-1711234567890-x1y2z3",
    "fee_on_customer": true,
    "created_at": "2026-03-09T10:30:00Z"
  },
  "payment": {
    "order_id": "550e8400-1711234567890-x1y2z3",
    "payment_type": "bni_va",
    "va_number": "8810123456789012",
    "bank": "bni",
    "payment_number": "8810123456789012",
    "expired_at": "2026-03-10T10:30:00Z",
    "total_payment": 106500
  }
}
Penting: amount di response = total yang dibayar customer (termasuk fee). Gunakan net_amount untuk jumlah merchant terima.
Check Status
GET /check-status?id=TRANSACTION_ID

Cek status pembayaran. Juga mendukung POST dengan body {"id": "..."}.

Response
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "settled",
    "amount": 50750,
    "fee": 750,
    "net_amount": 50000,
    "reference": "550e8400-1711234567890-a1b2c3",
    "created_at": "2026-03-09T10:30:00Z",
    "updated_at": "2026-03-09T10:35:00Z"
  }
}
Payment Types
Code	Metode	Fee	Response Field
qris	QRIS	0.7% + Rp 400	qr_string
gopay	GoPay	0.7% + Rp 400	qr_string, deeplink_url
shopeepay	ShopeePay	0.7% + Rp 400	deeplink_url
bni_va	BNI Virtual Account	Rp 6.500	va_number, bank
bri_va	BRI Virtual Account	Rp 6.500	va_number, bank
permata_va	Permata Virtual Account	Rp 6.500	va_number, bank
cimb_niaga_va	CIMB Niaga Virtual Account	Rp 6.500	va_number, bank
Status Flow
Setiap transaksi memiliki siklus: pending → settled atau pending → failed

Status	Deskripsi
pending	Transaksi dibuat, menunggu customer menyelesaikan pembayaran
settled	Pembayaran berhasil dikonfirmasi oleh payment gateway
failed	Pembayaran gagal, ditolak, atau expired
Webhooks
Jika proyek memiliki Webhook URL, Louvin akan mengirim HTTP POST setiap kali status transaksi berubah.

Webhook Payload
{
  "event": "payment.settled",
  "data": {
    "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
    "gateway_transaction_id": "gateway-uuid",
    "project_id": "project-uuid",
    "order_id": "550e8400-1711234567890-a1b2c3",
    "amount": 50750,
    "fee": 750,
    "net_amount": 50000,
    "payment_type": "qris",
    "status": "settled",
    "customer_name": "John Doe",
    "customer_email": "john@example.com"
  }
}
Event Types
Event	Deskripsi
payment.settled	Pembayaran berhasil dikonfirmasi
payment.failed	Pembayaran gagal, ditolak, atau expired
payment.pending	Status masih menunggu pembayaran
Contoh Handler (Express.js)
app.post('/webhook/louvin', (req, res) => {
  const { event, data } = req.body;

  if (event === 'payment.settled') {
    console.log('Pembayaran berhasil:', data.order_id);
    console.log('Jumlah diterima:', data.net_amount);
  }

  if (event === 'payment.failed') {
    console.log('Pembayaran gagal:', data.order_id);
  }

  // PENTING: selalu return 200
  res.status(200).json({ received: true });
});
⚠️ Selalu return HTTP 200 dari endpoint webhook. Response selain 200 akan dicatat sebagai gagal.
Subscription (Recurring Payments)
Fitur subscription memungkinkan merchant membuat paket langganan. Customer yang berlangganan akan otomatis menerima email berisi QRIS untuk perpanjangan H-1 sebelum masa aktif habis.

Alur Subscription
Merchant buat Plan (Dashboard → Langganan → Plans)
     ↓
Customer subscribe via SDK / API
     ↓
Subscription aktif (current_period_end = now + interval)
     ↓
H-1 expiry: sistem kirim email QRIS ke customer
     ↓
Customer scan & bayar → Midtrans webhook → settlement
     ↓
Otomatis: perpanjang current_period_end + interval
1. Buat Plan
Buat subscription plan di Dashboard → Langganan → Plans. Anda bisa set nama, harga, dan interval (daily, weekly, monthly, yearly). Salin plan_id untuk integrasi.

2. Create Subscription (API)
POST /create-subscription

Request Body
Parameter	Type	Required	Description
plan_id	string	✅	UUID plan dari Dashboard
customer_email	string	✅	Email customer (untuk kirim reminder QRIS)
customer_name	string		Nama customer
Contoh Request
const response = await fetch("https://api.louvin.dev/create-subscription", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "lv_your_api_key_here"
  },
  body: JSON.stringify({
    plan_id: "plan-uuid-from-dashboard",
    customer_email: "customer@example.com",
    customer_name: "John Doe"
  })
});

const data = await response.json();
Response (201 Created)
{
  "success": true,
  "subscription": {
    "id": "sub-uuid",
    "plan_id": "plan-uuid",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe",
    "status": "active",
    "current_period_start": "2026-03-28T00:00:00Z",
    "current_period_end": "2026-04-28T00:00:00Z"
  },
  "transaction": {
    "id": "txn-uuid",
    "amount": 50750,
    "status": "pending"
  },
  "payment": {
    "qr_string": "00020101021226...",
    "payment_type": "qris",
    "total_payment": 50750
  }
}
3. SDK Method
const louvin = new Louvin('lv_your_api_key');

const sub = await louvin.createSubscription({
  plan_id: 'plan-uuid-from-dashboard',
  customer_email: 'customer@example.com',
  customer_name: 'John Doe'
});

console.log(sub.subscription.id);
console.log(sub.payment.qr_string); // tampilkan QR ke customer
4. Auto-Renewal via Email
Sistem otomatis mengirim email ke customer_email berisi QR code QRIS 1 hari sebelum subscription habis. Setelah customer bayar, subscription diperpanjang otomatis.

💡 Merchant tidak perlu melakukan apa-apa — renewal berjalan otomatis selama subscription aktif.
5. Webhook Event
Saat subscription berhasil diperpanjang, webhook akan mengirim event tambahan:

Event	Deskripsi
subscription.renewed	Subscription berhasil diperpanjang setelah pembayaran QRIS
{
  "event": "subscription.renewed",
  "data": {
    "subscription_id": "sub-uuid",
    "plan_id": "plan-uuid",
    "customer_email": "customer@example.com",
    "new_period_end": "2026-05-28T00:00:00Z",
    "transaction_id": "txn-uuid",
    "amount": 50750
  }
}
Error Handling
Semua error dikembalikan dalam format JSON dengan field error dan opsional details.

Status	Penyebab	Solusi
400	Parameter tidak valid	Cek amount > 0, payment_type valid, QRIS min Rp 1.500
401	API key tidak valid	Pastikan header x-api-key benar dan proyek aktif
404	Transaksi tidak ditemukan	Cek transaction ID
500	Server error	Coba lagi atau hubungi support
Contoh Error Response
{
  "error": "Invalid amount. Must be a positive number."
}

// Dengan detail dari payment gateway:
{
  "error": "Payment gateway error",
  "gateway_status_code": "406",
  "details": "Order ID has been utilized."
}
Louvin Payment Gateway — louvin.dev — API v1.0