<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instansi;
use App\Models\Satker;
use App\Models\Rup;
use App\Models\PaketPengadaan;
use App\Models\Lelang;
use App\Models\LelangPeserta;
use App\Models\Vendor;
use App\Models\KontrakPekerjaan;
use App\Models\PekerjaanMilestone;
use App\Models\Penagihan;
use App\Models\Sanggahan;
use App\Models\DaftarHitam;
use App\Models\SystemSetting;
use App\Models\KriteriaPenilaian;

class ComprehensiveProcurementSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Instansi & Satker
        $instansi = Instansi::firstOrCreate(
            ['nama_instansi' => 'Kementerian Ketenagakerjaan RI'],
            ['jenis_instansi' => 'Pusat', 'alamat' => 'Jl. Gatot Subroto Kav. 51, Jakarta Selatan']
        );

        $satker = Satker::firstOrCreate(
            ['kode_satker' => 'STK-001'],
            ['instansi_id' => $instansi->id, 'nama_satker' => 'Biro Pengadaan Barang dan Jasa (PBJ)']
        );

        // 2. RUP
        $rupList = [
            [
                'kode_rup' => 'RUP-2026-001',
                'satker_id' => $satker->id,
                'nama_kegiatan' => 'Pengadaan Infrastruktur Server & Cloud Storage 2026',
                'tahun_anggaran' => 2026,
                'sumber_dana' => 'APBN',
                'nilai_pagu' => 750000000,
                'tipe_pengadaan' => 'Penyedia',
                'is_pdn' => 1,
                'is_umkk' => 1,
            ],
            [
                'kode_rup' => 'RUP-2026-002',
                'satker_id' => $satker->id,
                'nama_kegiatan' => 'Pengembangan Sistem Elektronik Terpadu (ACQUIRAS)',
                'tahun_anggaran' => 2026,
                'sumber_dana' => 'APBN',
                'nilai_pagu' => 450000000,
                'tipe_pengadaan' => 'Penyedia',
                'is_pdn' => 1,
                'is_umkk' => 1,
            ],
            [
                'kode_rup' => 'RUP-2026-003',
                'satker_id' => $satker->id,
                'nama_kegiatan' => 'Pengadaan Lisensi Software Keamanan & Pentest ISO 27001',
                'tahun_anggaran' => 2026,
                'sumber_dana' => 'APBN',
                'nilai_pagu' => 250000000,
                'tipe_pengadaan' => 'Penyedia',
                'is_pdn' => 0,
                'is_umkk' => 0,
            ],
        ];

        foreach ($rupList as $r) {
            Rup::firstOrCreate(['kode_rup' => $r['kode_rup']], $r);
        }

        // 3. Paket Pengadaan
        $rupServer = Rup::where('kode_rup', 'RUP-2026-001')->first();
        $rupSoftware = Rup::where('kode_rup', 'RUP-2026-002')->first();

        $paket1 = PaketPengadaan::firstOrCreate(
            ['kode_paket' => 'PKT-SRV-01'],
            [
                'rup_id' => $rupServer->id,
                'satker_id' => $satker->id,
                'nama_paket' => 'Pengadaan Cluster Server Baremetal EPYC & Storage NVMe',
                'jenis_paket' => 'tender',
                'jenis_pengadaan' => 'Barang',
                'metode_pengadaan' => 'Tender Umum',
                'jenis_kontrak' => 'Lumsum',
                'nilai_pagu' => 750000000,
                'nilai_hps' => 725000000,
                'tahun_anggaran' => 2026,
                'lokasi_pekerjaan' => 'Data Center Pusat, Jakarta',
                'tahap' => 'Pengadaan',
                'syarat_kualifikasi' => 'Memiliki NIB, Sertifikasi KBLI IT, Pengalaman min 3 tahun',
                'bobot_teknis' => 70,
                'bobot_harga' => 30,
            ]
        );

        $paket2 = PaketPengadaan::firstOrCreate(
            ['kode_paket' => 'PKT-SW-02'],
            [
                'rup_id' => $rupSoftware->id,
                'satker_id' => $satker->id,
                'nama_paket' => 'Pengadaan Jasa Konsultansi Software ACQUIRAS Web2-Web3 Hybrid',
                'jenis_paket' => 'tender',
                'jenis_pengadaan' => 'Jasa Konsultansi',
                'metode_pengadaan' => 'Seleksi',
                'jenis_kontrak' => 'Waktu Penugasan',
                'nilai_pagu' => 450000000,
                'nilai_hps' => 430000000,
                'tahun_anggaran' => 2026,
                'lokasi_pekerjaan' => 'Bandung & Jakarta',
                'tahap' => 'Pelaksanaan',
                'syarat_kualifikasi' => 'Pengalaman pengadaan sistem enterprise & blockchain',
                'bobot_teknis' => 80,
                'bobot_harga' => 20,
            ]
        );

        $paket3 = PaketPengadaan::firstOrCreate(
            ['kode_paket' => 'PKT-NT-03'],
            [
                'rup_id' => $rupServer->id,
                'satker_id' => $satker->id,
                'nama_paket' => 'Pengadaan Peralatan Switch & Router Jaringan Kantor Cabang',
                'jenis_paket' => 'non tender',
                'jenis_pengadaan' => 'Barang',
                'metode_pengadaan' => 'Pengadaan Langsung',
                'jenis_kontrak' => 'Lumsum',
                'nilai_pagu' => 95000000,
                'nilai_hps' => 90000000,
                'tahun_anggaran' => 2026,
                'lokasi_pekerjaan' => 'Bandung',
                'tahap' => 'Pengadaan',
                'bobot_teknis' => 70,
                'bobot_harga' => 30,
            ]
        );

        // 4. Lelang
        $lelang1 = Lelang::firstOrCreate(
            ['no_lelang' => 'LLG-202602-001'],
            [
                'paket_id' => $paket1->id,
                'judul_lelang' => 'Lelang Terbuka Pengadaan Cluster Server EPYC & Storage NVMe',
                'deskripsi_lelang' => 'Pengadaan 3 node server cluster Docker Swarm dan MinIO Storage sesuai spesifikasi teknis Acquiras.',
                'tanggal_mulai' => '2026-02-01',
                'jam_mulai' => '09:00:00',
                'tanggal_selesai' => '2026-02-28',
                'jam_selesai' => '17:00:00',
                'status' => 'Aktif',
                'created_by' => 1,
            ]
        );

        $lelang2 = Lelang::firstOrCreate(
            ['no_lelang' => 'LLG-202601-002'],
            [
                'paket_id' => $paket2->id,
                'judul_lelang' => 'Lelang Konsultansi Implementasi Sistem Pengadaan ACQUIRAS 2026',
                'deskripsi_lelang' => 'Pengembangan frontend SPA React, API Express/Laravel, dan modul audit trail Web3.',
                'tanggal_mulai' => '2026-01-10',
                'jam_mulai' => '08:00:00',
                'tanggal_selesai' => '2026-02-15',
                'jam_selesai' => '16:00:00',
                'status' => 'Masa Sanggah',
                'created_by' => 1,
            ]
        );

        $lelang3 = Lelang::firstOrCreate(
            ['no_lelang' => 'LLG-202602-003'],
            [
                'paket_id' => $paket3->id,
                'judul_lelang' => 'Pengadaan Langsung Switch & Router Kantor Cabang',
                'deskripsi_lelang' => 'Pengadaan langsung perangkat jaringan Cisco/Mikrotik untuk 5 titik cabang.',
                'tanggal_mulai' => '2026-02-10',
                'jam_mulai' => '09:00:00',
                'tanggal_selesai' => '2026-02-20',
                'jam_selesai' => '15:00:00',
                'status' => 'Aktif',
                'created_by' => 1,
            ]
        );

        // 5. Peserta Lelang
        $vendor1 = Vendor::find(1);
        $vendor2 = Vendor::find(4) ?: Vendor::where('id_vendor_code', 'VND-002')->first();

        if ($vendor1 && $lelang1) {
            LelangPeserta::firstOrCreate(
                ['lelang_id' => $lelang1->id, 'vendor_id' => $vendor1->id],
                [
                    'nilai_penawaran' => 715000000,
                    'skor_teknis' => 88.50,
                    'skor_harga' => 92.00,
                    'total_skor' => 89.55,
                    'status_peserta' => 'Memasukkan Penawaran',
                ]
            );
        }

        if ($vendor2 && $lelang2) {
            LelangPeserta::firstOrCreate(
                ['lelang_id' => $lelang2->id, 'vendor_id' => $vendor2->id],
                [
                    'nilai_penawaran' => 420000000,
                    'skor_teknis' => 92.00,
                    'skor_harga' => 95.00,
                    'total_skor' => 92.60,
                    'status_peserta' => 'Pemenang',
                ]
            );
        }

        // 6. Kontrak Pekerjaan & Milestones
        if ($vendor2) {
            $kontrak = KontrakPekerjaan::firstOrCreate(
                ['nomor_kontrak' => 'KTR/2026/01/PBJ-008'],
                [
                    'paket_id' => $paket2->id,
                    'vendor_id' => $vendor2->id,
                    'tanggal_kontrak' => '2026-02-16',
                    'tanggal_mulai' => '2026-02-18',
                    'tanggal_selesai' => '2026-06-30',
                    'nilai_kontrak' => 420000000,
                    'progres_persen' => 60,
                    'status_pekerjaan' => 'progress',
                ]
            );

            // Milestones
            PekerjaanMilestone::firstOrCreate(
                ['kontrak_id' => $kontrak->id, 'judul_milestone' => 'Tahap 1: Analisis Kebutuhan & Desain Arsitektur'],
                [
                    'urutan' => 1,
                    'target_persen' => 30.00,
                    'realisasi_persen' => 30.00,
                    'target_selesai' => '2026-03-15',
                    'realisasi_selesai' => '2026-03-12',
                    'status' => 'completed',
                ]
            );

            PekerjaanMilestone::firstOrCreate(
                ['kontrak_id' => $kontrak->id, 'judul_milestone' => 'Tahap 2: Pengembangan Frontend React & Backend API'],
                [
                    'urutan' => 2,
                    'target_persen' => 30.00,
                    'realisasi_persen' => 30.00,
                    'target_selesai' => '2026-04-30',
                    'realisasi_selesai' => '2026-04-28',
                    'status' => 'completed',
                ]
            );

            PekerjaanMilestone::firstOrCreate(
                ['kontrak_id' => $kontrak->id, 'judul_milestone' => 'Tahap 3: Uji Coba Integrasi & UAT'],
                [
                    'urutan' => 3,
                    'target_persen' => 40.00,
                    'realisasi_persen' => 0.00,
                    'target_selesai' => '2026-06-30',
                    'status' => 'in_progress',
                ]
            );

            // 7. Penagihan (Invoicing)
            Penagihan::firstOrCreate(
                ['no_penagihan' => 'INV-2026-001'],
                [
                    'kontrak_id' => $kontrak->id,
                    'vendor_id' => $vendor2->id,
                    'termin_ke' => 1,
                    'jumlah_tagihan' => 126000000,
                    'tanggal_penagihan' => '2026-03-20',
                    'deadline_pembayaran' => '2026-04-03',
                    'keterangan' => 'Pembayaran Termin 1 (30%) setelah penyelesaian Analisis & Blueprint Sistem',
                    'status' => 'dibayar',
                    'tanggal_dibayar' => '2026-04-01 10:15:00',
                ]
            );

            Penagihan::firstOrCreate(
                ['no_penagihan' => 'INV-2026-002'],
                [
                    'kontrak_id' => $kontrak->id,
                    'vendor_id' => $vendor2->id,
                    'termin_ke' => 2,
                    'jumlah_tagihan' => 126000000,
                    'tanggal_penagihan' => '2026-05-02',
                    'deadline_pembayaran' => '2026-05-16',
                    'keterangan' => 'Pembayaran Termin 2 (30%) Pengembangan Frontend & Backend API',
                    'status' => 'dikirim',
                ]
            );
        }

        // 8. Sanggahan
        if ($vendor1 && $lelang2) {
            Sanggahan::firstOrCreate(
                ['no_surat' => 'SGH-2026/02/001'],
                [
                    'lelang_id' => $lelang2->id,
                    'vendor_id' => $vendor1->id,
                    'tanggal_sanggah' => '2026-02-18',
                    'alasan_sanggah' => 'Mohon klarifikasi penilaian bobot teknis dan pengalaman sejenis pada evaluasi penawaran.',
                    'status' => 'diterima',
                    'jawaban_sanggah' => 'Panitia telah memeriksa kembali dokumen kualifikasi dan konfirmasi penilaian sudah sesuai dengan ketentuan KAK.',
                    'tanggal_jawaban' => '2026-02-21 14:00:00',
                ]
            );
        }

        // 9. Daftar Hitam (Blacklist)
        $userBad = \App\Models\User::firstOrCreate(
            ['username' => 'vendor_mitra'],
            [
                'email' => 'contact@mitratirta.co.id',
                'role_id' => 2,
                'password_hash' => bcrypt('password'),
                'first_name' => 'PT Mitra Tirta Abadi',
                'is_active' => 0,
            ]
        );

        $badVendor = Vendor::firstOrCreate(
            ['id_vendor_code' => 'VND-BLK-099'],
            [
                'user_id' => $userBad->id,
                'nama_perusahaan' => 'PT Mitra Tirta Abadi',
                'bentuk_usaha' => 'PT',
                'npwp' => '01.999.888.7-012.000',
                'alamat' => 'Kawasan Industri Pulo Gadung, Jakarta',
                'provinsi' => 'DKI Jakarta',
                'kabupaten_kota' => 'Jakarta Timur',
                'no_telepon' => '021-4601111',
                'email_perusahaan' => 'contact@mitratirta.co.id',
                'kualifikasi' => 'Menengah',
            ]
        );

        DaftarHitam::firstOrCreate(
            ['nomor_sk' => 'SK-PBJ/091/2025'],
            [
                'vendor_id' => $badVendor->id,
                'skenario' => 'Wanprestasi Proyek',
                'tanggal_mulai' => '2025-08-01',
                'tanggal_selesai' => '2027-08-01',
                'durasi_sanksi' => '2 Tahun',
                'alasan' => 'Gagal menyelesaikan pekerjaan pengadaan genset darurat dan tidak menanggapi SP3.',
                'status' => 'Aktif',
            ]
        );

        // 10. Kriteria Penilaian
        $kriterias = [
            ['nama_kriteria' => 'Ketepatan Waktu & Timeline Delivery', 'kategori' => 'Teknis'],
            ['nama_kriteria' => 'Kesesuaian Spesifikasi Teknis & Kualitas', 'kategori' => 'Teknis'],
            ['nama_kriteria' => 'Kelengkapan Dokumen Legalitas & KSWP', 'kategori' => 'Administrasi'],
            ['nama_kriteria' => 'Pengalaman Kerja Sejenis (3 Tahun Terakhir)', 'kategori' => 'Kualifikasi'],
            ['nama_kriteria' => 'Kewajaran Penawaran Harga', 'kategori' => 'Harga'],
        ];

        foreach ($kriterias as $k) {
            KriteriaPenilaian::firstOrCreate(['nama_kriteria' => $k['nama_kriteria']], $k);
        }

        // 11. System Settings
        $settings = [
            ['setting_key' => 'app_name', 'setting_value' => 'ACQUIRAS E-PROC 2026', 'setting_group' => 'general'],
            ['setting_key' => 'company_name', 'setting_value' => 'PT Pratama Solusi Teknologi', 'setting_group' => 'general'],
            ['setting_key' => 'enable_blockchain_audit', 'setting_value' => '1', 'setting_group' => 'web3'],
            ['setting_key' => 'blockchain_network', 'setting_value' => 'Polygon / Base', 'setting_group' => 'web3'],
            ['setting_key' => 'contract_standard_termin', 'setting_value' => '3 Tahap (30% - 30% - 40%)', 'setting_group' => 'procurement'],
            ['setting_key' => 'notification_channel', 'setting_value' => 'Email & WhatsApp Realtime', 'setting_group' => 'notification'],
        ];

        foreach ($settings as $s) {
            SystemSetting::firstOrCreate(['setting_key' => $s['setting_key']], $s);
        }
    }
}
