export interface Blacklist {
    id : number;
    nama_perusahaan : string;
    skenario : string;
    no_paket : string;
    paket : string;
    masa_blacklist : Date;
    tanggal_blacklist : Date;
    duration_blacklist : string;
    alasan : string;
    status : string;
    dateCreated: Date;
    dateUpdated: Date;
}


const fakers = {
    fakeBlacklist(): Array<Blacklist>{
        const blacklist: Array<Blacklist> = [
            {
                id: 1,
                nama_perusahaan: "PT. Maju Jaya",
                skenario: "Tender",
                no_paket: "PKT-001",
                paket: "Pembangunan Jalan",
                masa_blacklist: new Date("2025-12-31"),
                tanggal_blacklist: new Date("2024-01-01"),
                duration_blacklist: "12 Bulan",
                alasan: "Tidak memenuhi syarat administrasi",
                status: "Aktif",
                dateCreated: new Date(),
                dateUpdated: new Date()
            },
            {
                id: 2,
                nama_perusahaan: "CV. Sukses Abadi",
                skenario: "Non Tender",
                no_paket: "PKT-002",
                paket: "Pengadaan Alat Tulis Kantor",
                masa_blacklist: new Date("2024-06-30"),
                tanggal_blacklist: new Date("2023-07-01"),
                duration_blacklist: "6 Bulan",
                alasan: "Melakukan penipuan dalam proses pengadaan",
                status: "Aktif",
                dateCreated: new Date(),
                dateUpdated: new Date()
            }
        ];
        return blacklist;
    }
};

export default fakers;