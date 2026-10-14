# Acquiras - E-Procurement System with Blockchain Audit Trail

Sistem Informasi Pengadaan Barang dan Jasa Elektronik (**E-Procurement**) modern berbasis arsitektur **Hybrid Web2-Web3**. Sistem ini menggabungkan kemudahan antarmuka web konvensional (*Zero Friction / Invisible Web3*) dengan jaminan transparansi, anti-kecurangan, dan integritas data permanen (*immutable audit trail*) menggunakan **Smart Contract Solidity**.

---

## 📑 Daftar Isi
- [Teknologi & Arsitektur](#-teknologi--arsitektur)
- [Konsep Invisible Web3 (Gasless Audit)](#-konsep-invisible-web3-gasless-audit)
- [Informasi Smart Contract](#-informasi-smart-contract)
- [Modul & Fungsi Smart Contract](#-modul--fungsi-smart-contract)
- [Panduan Pengujian di Remix IDE](#-panduan-pengujian-di-remix-ide)
- [Konfigurasi Environment (.env)](#-konfigurasi-environment-env)
- [Cara Menjalankan Aplikasi](#-cara-menjalankan-aplikasi)
- [Hak Akses Akun Pengujian](#-hak-akses-akun-pengujian)

---

## 🛠 Teknologi & Arsitektur

### Frontend & UI
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + Tailwise Admin UI Framework
- **Ethers.js v5/v6** (Web3 Provider & Contract Utilities)
- **Lucide Icons** & Headless UI

### Backend & Database
- **Laravel 11** (PHP 8.3) REST API
- **MySQL 8.0**
- Cryptographic Service: Otomatisasi kalkulasi SHA-256 data hash & audit proof

### Blockchain & Smart Contract
- **Solidity ^0.8.20**
- EVM Compatible (Remix VM Cancun / Polygon Amoy / Base Sepolia / Ethereum Sepolia)
- Standar IPFS CID (v0/v1) untuk penyimpanan desentralisasi dokumen KAK & BAHP

---

## 🔒 Konsep Invisible Web3 (Gasless Audit)

Dalam pengadaan sektor publik/BUMN, mewajibkan rekanan atau panitia pengadaan memasang dompet kripto (seperti MetaMask) dan membayar gas fee adalah hambatan besar (*high friction*).

ACQUIRAS menyelesaikan masalah ini dengan pendekatan **Invisible Web3**:
1. **Pengguna Web**: Mengisi formulir lelang, mengunggah penawaran, dan menandatangani dokumen seperti aplikasi web biasa tanpa popup dompet kripto.
2. **Sistem Internal**: Server secara otomatis menghitung *cryptographic digest* (SHA-256) dari rincian paket/penawaran.
3. **Penyegelan On-Chain**: Bukti hash dan status dikunci ke Smart Contract. Data tidak dapat diubah diam-diam oleh admin database sekalipun (*anti-tamper*).
4. **Sertifikat Audit**: Setiap tahapan memiliki badge audit interaktif yang memverifikasi keaslian hash langsung ke blockchain.

---

## 📜 Informasi Smart Contract

| Parameter | Detail |
|---|---|
| **Nama Kontrak** | `AcquirasProcurement.sol` |
| **Lokasi Berkas** | `contracts/AcquirasProcurement.sol` |
| **Solidity Compiler** | `^0.8.20` |
| **Default Active Address** | `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47` |
| **Deployment Target** | Remix VM (Cancun) / EVM Testnet (Sepolia, Amoy) |
| **ABI Reference** | `src/config/acquirasAbi.ts` |

---

## ⚙️ Modul & Fungsi Smart Contract

Smart Contract `AcquirasProcurement` mencakup 5 siklus utama pengadaan:

```
[1. Publish Tender] ──> [2. Submit Bid] ──> [3. Award Winner] ──> [4. Record Signature] ──> [5. Milestone Escrow]
   (Kunci HPS & KAK)    (Sealed-Bid Vendor)   (Penetapan Pemenang)      (TTE BSrE Kontrak)       (Pencairan SPB Termin)
```

### 1. Tender Management (`publishTender`)
Mengunci pagu anggaran/HPS, tanggal mulai, batas akhir penawaran, serta tautan IPFS dokumen Kerangka Acuan Kerja (KAK).
```solidity
function publishTender(
    uint256 _tenderId,
    string calldata _kodePaket,
    string calldata _namaPaket,
    uint256 _nilaiHps,
    string calldata _ipfsKakCid,
    bytes32 _dataHash,
    uint256 _tanggalMulai,
    uint256 _tanggalSelesai
) external onlyAdmin;
```

### 2. Perekaman Penawaran Tersegel Rekanan (`submitBid`)
Mencatat pengajuan penawaran rekanan beserta enkripsi hash penawaran (*Sealed-Bid*) sehingga nominal penawaran terlindungi sebelum waktu pembukaan penawaran.
```solidity
function submitBid(
    uint256 _tenderId,
    uint256 _vendorId,
    uint256 _penawaranHarga,
    string calldata _ipfsDokumenPenawaran,
    bytes32 _penawaranHash
) external;
```

### 3. Penetapan Pemenang Lelang (`awardWinner`)
Mengunci vendor pemenang lelang dan Berita Acara Hasil Pemilihan (BAHP) yang tidak dapat diganggu gugat.
```solidity
function awardWinner(
    uint256 _tenderId,
    uint256 _winnerVendorId,
    uint256 _finalPrice,
    string calldata _ipfsBeritaAcara
) external onlyAdmin;
```

### 4. Perekaman TTE Digital Dokumen (`recordSignature`)
Mencatat sertifikat TTE (BSrE) pejabat pembuat komitmen (PPK) / penyedia dan memvalidasi keaslian berkas PDF melalui verifikasi hash SHA-256.
```solidity
function recordSignature(
    uint256 _refId,
    string calldata _docType,
    bytes32 _documentHash,
    string calldata _signerName,
    string calldata _bsreCertId
) external;
```

### 5. Escrow & Pembayaran Termin SPB (`recordMilestoneInvoice` & `approveMilestonePayment`)
Mengawal termin pekerjaan, Berita Acara Pembayaran (BAP), dan penerbitan Surat Perintah Bayar (SPB) agar pembayaran hanya cair sesuai progres fisik yang valid.
```solidity
function recordMilestoneInvoice(
    uint256 _kontrakId,
    uint8 _terminKe,
    string calldata _noPenagihan,
    uint256 _jumlahTagihan,
    string calldata _ipfsBapCid
) external;

function approveMilestonePayment(
    uint256 _kontrakId,
    uint8 _terminKe,
    string calldata _noSpb
) external onlyAdmin;
```

---

## 🧪 Panduan Pengujian di Remix IDE

Untuk mensimulasikan dan menguji seluruh fungsi Smart Contract di browser menggunakan [Remix IDE](https://remix.ethereum.org/):

### Langkah Awal (Setup di Remix):
1. Buka [Remix IDE](https://remix.ethereum.org/).
2. Buat file baru di folder `contracts/` bernama `AcquirasProcurement.sol`.
3. Salin seluruh isi kode dari file lokal `contracts/AcquirasProcurement.sol` ke Remix.
4. Buka tab **Solidity Compiler**:
   - Pilih Compiler Version: `0.8.20` atau lebih baru.
   - Klik **Compile AcquirasProcurement.sol** (pastikan centang hijau muncul).
5. Buka tab **Deploy & Run Transactions**:
   - Environment: `Remix VM (Cancun)`.
   - Di bagian **Deploy**, klik tombol oranye **Deploy**.
   - Alamat kontrak akan muncul di bawah **Deployed Contracts**.

---

### Skenario Pengujian Bertahap:

#### 1. Uji Publikasi Paket Lelang Baru (`publishTender`)
- Buka dropdown fungsi oranye **`publishTender`**.
- Masukkan parameter berikut:
  ```text
  8, "PKT-01", "Pengadaan Laptop Asus 10 Unit", 49000000, "QmAcquirasKAKDocsSealedOnChain2026", "0x89f1d43a65239e01bc3d2e9b812f4510aa29b9f71c4912e845cba0281987ef12", 1791936000, 1793145600
  ```
- Klik **`transact`**.
- **Cek Hasil**: Cari tombol biru **`getTender`**, masukkan angka `8`, klik tombolnya. Rincian lelang akan tampil dengan status `1` (*Published*).

#### 2. Uji Penawaran Rekanan (`submitBid`)
- Buka dropdown fungsi oranye **`submitBid`**.
- Masukkan penawaran dari Rekanan ID `2` sebesar Rp 46.500.000:
  ```text
  8, 2, 46500000, "QmPenawaranVendor2Asus2026", "0x5a1b3c7d9e8f0123456789abcdef0123456789abcdef0123456789abcdef0123"
  ```
- Klik **`transact`**.
- **Cek Hasil**: Cari tombol biru **`getBid`**, isi `8, 2`, klik tombolnya. Akan muncul harga penawaran `46500000` dengan status `0` (*Submitted*).

#### 3. Uji Penetapan Pemenang (`awardWinner`)
- Buka dropdown fungsi oranye **`awardWinner`**.
- Tetapkan Vendor 2 sebagai pemenang:
  ```text
  8, 2, 46500000, "QmBeritaAcaraHasilPemilihanBAHP2026"
  ```
- Klik **`transact`**.
- **Cek Hasil**: Panggil kembali **`getTender(8)`**, status lelang otomatis berubah menjadi `3` (*Awarded*) dan `winnerVendorId` bernilai `2`.

#### 4. Uji Perekaman TTE Digital Kontrak (`recordSignature`)
- Buka dropdown fungsi oranye **`recordSignature`**.
- Masukkan parameter pengesahan dokumen SPK:
  ```text
  8, "KONTRAK", "0x89f1d43a65239e01bc3d2e9b812f4510aa29b9f71c4912e845cba0281987ef12", "Pejabat Pembuat Komitmen (PPK)", "BSRE-CERT-2026-X99"
  ```
- Klik **`transact`**.
- **Cek Hasil**: Masukkan hash dokumen tadi ke tombol biru **`verifyDocumentHash`**. Smart contract akan mengembalikan nilai **`true`** (Sah dan Terverifikasi).

#### 5. Uji Penagihan & SPB Termin Escrow
1. Rekam Invoice Termin 1 di fungsi **`recordMilestoneInvoice`**:
   ```text
   1, 1, "INV-2026-001", 15000000, "QmBapTermin1Laptop"
   ```
   Klik **`transact`**.
2. Pejabat Keuangan menerbitkan Surat Perintah Bayar di fungsi **`approveMilestonePayment`**:
   ```text
   1, 1, "SPB-2026-BAP-01"
   ```
   Klik **`transact`**. Status milestone otomatis berubah menjadi *Paid*.

---

## 🔑 Konfigurasi Environment (.env)

Pastikan alamat kontrak tersinkronisasi di kedua environment:

### Frontend (`.env`):
```env
VITE_API_URL="http://localhost:8000/api"
VITE_BLOCKCHAIN_CONTRACT_ADDRESS="0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"
VITE_BLOCKCHAIN_NETWORK="Remix VM / EVM Testnet"
```

### Backend (`laravel-base/.env`):
```env
BLOCKCHAIN_CONTRACT_ADDRESS="0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"
BLOCKCHAIN_RPC_URL="http://127.0.0.1:8545"
BLOCKCHAIN_CHAIN_ID="1337"
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Jalankan Backend (Laravel)
```bash
cd laravel-base
php artisan serve --port=8000
```

### 2. Jalankan Frontend (React + Vite)
```bash
npm install
npm run dev
```
Buka browser di: **[http://localhost:3001](http://localhost:3001)**

---

## 👥 Hak Akses Akun Pengujian

| Peran | Username | Password | Deskripsi |
|---|---|---|---|
| **Admin / Panitia** | `admin` | `password` | Mengelola paket, verifikasi rekanan, dan publish ke smart contract |
| **Rekanan / Vendor** | `vendor2` | `password` | Mengikuti lelang, input penawaran harga & upload dokumen penawaran |

---

© 2026 **ACQUIRAS** — E-Procurement Hybrid Web2-Web3