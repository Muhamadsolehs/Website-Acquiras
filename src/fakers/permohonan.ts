import _ from "lodash";

export interface Permohonan {
  id: string;
  no_ticket: string;
  title: string;
  date: string;
  status: string;
  pemohon?: Pemohon;
  ahli?: Ahli;
}

export interface Pemohon {
  id: string;
  name: string;
  email: string;
  no: string;
  instance: string;
  satker: string;
  status: boolean;
}

export interface Ahli {
  id: string;
  name: string;
  email: string;
  no: string;
  position: string;
  province: string;
  date_login: string;
}

const fakers = {
  fakePermohonans() {
    const permohonan: Permohonan[] = [
      {
        id: "1",
        no_ticket: "TKT-20251012-001",
        title: "Pengadaan Laptop untuk Divisi IT",
        date: "2025-10-12",
        status: "pending",
        pemohon: {
          id: "1",
          name: "Andi Pratama",
          email: "andi.pratama@mail.com",
          no: "081234567890",
          instance: "Dinas Kominfo",
          satker: "Bidang Infrastruktur TI",
          status: false,
        },
        ahli: {
          id: "1",
          name: "Budi Santoso",
          email: "budi.santoso@mail.com",
          no: "081298765432",
          position: "Manajer Pengadaan",
          province: "Jawa Barat",
          date_login: "2025-10-10",
        },
      },
      {
        id: "2",
        no_ticket: "TKT-20251014-002",
        title: "Pembelian Alat Tulis Kantor (ATK)",
        date: "2025-10-14",
        status: "pending",
        pemohon: {
          id: "2",
          name: "Siti Marlina",
          email: "siti.marlina@mail.com",
          no: "082134567891",
          instance: "Dinas Pendidikan",
          satker: "Sekretariat Umum",
          status: true,
        },
        ahli: {
          id: "2",
          name: "Rudi Haryono",
          email: "rudi.haryono@mail.com",
          no: "085634567899",
          position: "Kepala Seksi Pengadaan",
          province: "Jawa Barat",
          date_login: "2025-10-11",
        },
      },
      {
        id: "3",
        no_ticket: "TKT-20251015-003",
        title: "Pengadaan Server Baru untuk Data Center",
        date: "2025-10-15",
        status: "selesai",
        pemohon: {
          id: "3",
          name: "Rahmat Nugraha",
          email: "rahmat.nugraha@mail.com",
          no: "081377772222",
          instance: "Badan Keuangan Daerah",
          satker: "Bidang Teknologi Informasi",
          status: true,
        },
        ahli: {
          id: "3",
          name: "Intan Ayu",
          email: "intan.ayu@mail.com",
          no: "082188899900",
          position: "Konsultan TI",
          province: "Jawa Tengah",
          date_login: "2025-10-13",
        },
      },
      {
        id: "4",
        no_ticket: "TKT-20251017-004",
        title: "Pembaruan Lisensi Microsoft Office",
        date: "2025-10-17",
        status: "selesai",
        pemohon: {
          id: "4",
          name: "Dewi Kurnia",
          email: "dewi.kurnia@mail.com",
          no: "081255544433",
          instance: "Sekretariat Daerah",
          satker: "Bagian Umum",
          status: true,
        },
        ahli: {
          id: "4",
          name: "Eka Saputra",
          email: "eka.saputra@mail.com",
          no: "087755544433",
          position: "Supervisor IT",
          province: "Jawa Timur",
          date_login: "2025-10-14",
        },
      },
      {
        id: "5",
        no_ticket: "TKT-20251018-005",
        title: "Pengadaan Kursi Ergonomis Karyawan",
        date: "2025-10-18",
        status: "selesai",
        pemohon: {
          id: "5",
          name: "Lukman Hakim",
          email: "lukman.hakim@mail.com",
          no: "081344455566",
          instance: "Dinas Kesehatan",
          satker: "Bagian Umum & Kepegawaian",
          status: true,
        },
        ahli: {
          id: "5",
          name: "Yuni Arifin",
          email: "yuni.arifin@mail.com",
          no: "081399988877",
          position: "Kepala Pengadaan",
          province: "Jawa Timur",
          date_login: "2025-10-16",
        },
      },
    ];
    return _.shuffle(permohonan);
  },
};

export default fakers;
