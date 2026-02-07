import _ from "lodash";

export interface RUP{
    id: number;
    kode_rup: string;
    sumber_dana: string;
}
export interface Paket {
    id: number;
    kode_paket: string;
    nama_paket: string;
    jenis_paket: string; // tender, non tender
    satker: string;
    jenis_kontrak: string;
    tahap: string;
    jenis_pengadaan: string;
    metode_pengadaan: string;
    nilai: number;
    tahun_anggaran: number;
    syarat: string;
    lokasi: string;
    bobot_teknis: number;
    bobot_harga: number;
    harga: number;
    rup: RUP;
    dateCreated: Date;
    dateUpdated: Date;

}

const fakers = {

    fakePaket(){
        const paket: Array<Paket> = [
            {
                id: 1,
                kode_paket: "PKT-001",
                nama_paket: "Pembangunan Jalan",
                jenis_paket: "tender",
                satker: "Dinas Pekerjaan Umum",
                jenis_kontrak: "Lump Sum",
                tahap: "Pengadaan",
                jenis_pengadaan: "Barang/Jasa Konstruksi",
                metode_pengadaan: "Tender Terbuka",
                nilai: 1500000000,
                tahun_anggaran: 2024,
                syarat: "Memiliki pengalaman minimal 3 tahun",
                lokasi: "Jakarta",
                bobot_teknis: 70,
                bobot_harga: 30,
                harga: 1450000000,
                rup: {
                    id: 101,
                    kode_rup: "RUP-2024-001",
                    sumber_dana: "APBN"
                },
                dateCreated: new Date(),
                dateUpdated: new Date()
            },
            {
                id: 2,
                kode_paket: "PKT-002",
                nama_paket: "Pengadaan Perangkat IT",
                jenis_paket: "non tender",
                satker: "Dinas Kominfo",
                jenis_kontrak: "Harga Satuan",
                tahap: "Evaluasi",
                jenis_pengadaan: "Barang",
                metode_pengadaan: "Pengadaan Langsung",
                nilai: 350000000,
                tahun_anggaran: 2024,
                syarat: "Memiliki sertifikasi resmi",
                lokasi: "Bandung",
                bobot_teknis: 60,
                bobot_harga: 40,
                harga: 335000000,
                rup: {
                    id: 102,
                    kode_rup: "RUP-2024-002",
                    sumber_dana: "APBD"
                },
                dateCreated: new Date(),
                dateUpdated: new Date()
            },
            {
                id: 3,
                kode_paket: "PKT-003",
                nama_paket: "Pengadaan Alat Berat",
                jenis_paket: "tender",
                satker: "Dinas Pekerjaan Umum",
                jenis_kontrak: "Lump Sum",
                tahap: "Masa Sanggah",
                jenis_pengadaan: "Barang",
                metode_pengadaan: "Pengadaan Langsung",
                nilai: 350000000,
                tahun_anggaran: 2024,
                syarat: "Memiliki sertifikasi resmi",
                lokasi: "Bandung",
                bobot_teknis: 60,
                bobot_harga: 40,
                harga: 335000000,
                rup: {
                    id: 102,
                    kode_rup: "RUP-2024-002",
                    sumber_dana: "APBD"
                },
                dateCreated: new Date(),
                dateUpdated: new Date()
            },
            {
                id: 4,
                kode_paket: "PKT-004",
                nama_paket: "Pengadaan Alat Berat",
                jenis_paket: "non tender",
                satker: "Dinas Pekerjaan Umum",
                jenis_kontrak: "Lump Sum",
                tahap: "Pengumuman",
                jenis_pengadaan: "Barang",
                metode_pengadaan: "Pengadaan Langsung",
                nilai: 350000000,
                tahun_anggaran: 2024,
                syarat: "Memiliki sertifikasi resmi",
                lokasi: "Bandung",
                bobot_teknis: 60,
                bobot_harga: 40,
                harga: 335000000,
                rup: {
                    id: 102,
                    kode_rup: "RUP-2024-002",
                    sumber_dana: "APBD"
                },
                dateCreated: new Date(),
                dateUpdated: new Date()
            },
            {
                id: 5,
                kode_paket: "PKT-005",
                nama_paket: "Pengadaan Alat Berat",
                jenis_paket: "non tender",
                satker: "Dinas Pekerjaan Umum",
                jenis_kontrak: "Lump Sum",
                tahap: "Selesai & Belum Dibayar",
                jenis_pengadaan: "Barang",
                metode_pengadaan: "Pengadaan Langsung",
                nilai: 350000000,
                tahun_anggaran: 2024,
                syarat: "Memiliki sertifikasi resmi",
                lokasi: "Bandung",
                bobot_teknis: 60,
                bobot_harga: 40,
                harga: 335000000,
                rup: {
                    id: 102,
                    kode_rup: "RUP-2024-002",
                    sumber_dana: "APBD"
                },
                dateCreated: new Date(),
                dateUpdated: new Date()
            }
        ];
        return _.shuffle(paket);  
    }

}

export default fakers;
