import _ from "lodash";
import dayjs from "dayjs";

type UploadedFile = {
  filename: string;
  size: string;
  fileType: string;
};

export interface Activity {
  date: string;
  activity: string;
  activityDetails?: string;
  uploadedFiles?: UploadedFile[];
  statusBadge: string;
  images?: string[];
}

const imageAssets = import.meta.glob<{
  default: string;
}>("/src/assets/images/projects/*.{jpg,jpeg,png,svg}", { eager: true });

const filteredImages = Object.keys(imageAssets).filter(
  (file) => file.search("400x400") !== -1
);

const fakers = {
  fakeActivities() {
    const activities: Activity[] = [
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Viewed Monitoring Pengadaan",
        activityDetails: "Membuka dashboard Monitoring Pengadaan (2024)",
        statusBadge: "Info",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Exported Procurement Data",
        activityDetails: "Exported CSV dari Monitoring Pengadaan untuk tahun 2024",
        uploadedFiles: [
          {
            filename: "monitoring_pengadaan_2024.csv",
            size: "1.2MB",
            fileType: "CSV",
          },
        ],
        statusBadge: "Completed",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Opened Lelang - Daftar Lelang",
        activityDetails: "Melihat detail lelang PKT-001 (Pembangunan Jalan)",
        statusBadge: "Success",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Submitted Bid",
        activityDetails: "PT Vendor 3 mengajukan penawaran untuk PKT-002",
        uploadedFiles: [
          { filename: "penawaran_pkt002.pdf", size: "2.1MB", fileType: "PDF" },
        ],
        statusBadge: "New",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Added Vendor",
        activityDetails: "Menambahkan Data Master Vendor: PT. Nusantara Konstruksi",
        statusBadge: "Completed",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Viewed Progress Pekerjaan",
        activityDetails: "Memeriksa progress paket PKT-003 oleh vendor PT Vendor 1",
        statusBadge: "Info",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Updated Vendor Profile",
        activityDetails: "Memperbarui alamat dan kontak PT. Nusantara Konstruksi",
        statusBadge: "Success",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Generated Report - Progress Pekerjaan",
        activityDetails: "Membuat laporan progress per paket untuk satker Dinas Pekerjaan Umum",
        uploadedFiles: [
          { filename: "report_progress_apr2024.pdf", size: "850KB", fileType: "PDF" },
        ],
        statusBadge: "Completed",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Changed Settings",
        activityDetails: "Mengupdate pengaturan Log Activity (mode notifikasi)",
        statusBadge: "Success",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Uploaded Documents for Package",
        activityDetails: "Mengunggah dokumen kontrak untuk PKT-001",
        uploadedFiles: [
          { filename: "kontrak_pkt001_signed.pdf", size: "1.4MB", fileType: "PDF" },
        ],
        statusBadge: "Completed",
        images: [
          imageAssets[filteredImages[_.random(0, filteredImages.length - 1)]].default,
        ],
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "User Login",
        activityDetails: "User admin logged in ke sistem",
        statusBadge: "Success",
      },
      {
        date: dayjs
          .unix(_.random(1700000000, 1730000000))
          .format("DD MMMM YYYY"),
        activity: "Viewed Daftar Hitam",
        activityDetails: "Melihat daftar perusahaan yang masuk blacklist",
        statusBadge: "Info",
      },
    ];

    return _.shuffle(activities);
  },
};
export default fakers;
