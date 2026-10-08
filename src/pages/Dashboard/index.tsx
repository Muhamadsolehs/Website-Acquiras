import Lucide from "@/components/Base/Lucide";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import ReportBarChart6 from "@/components/ReportBarChart6";
import ReportBarChart1 from "@/components/ReportBarChart1";
import _ from "lodash";
import Litepicker from "@/components/Base/Litepicker";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosinstance";

type DashboardStats = {
  total_vendor: number;
  total_lelang: number;
  total_tender: number;
  total_non_tender: number;
  total_rup?: number;
  total_kontrak?: number;
  total_daftar_hitam?: number;
  total_sanggahan?: number;
  total_penagihan?: number;
  total_pagu?: number;
  recent_lelang?: any[];
};

function Main() {
  const navigate = useNavigate();
  const [generalReportFilter, setGeneralReportFilter] = useState<string>();
  const [userRole, setUserRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>({});

  // State untuk menyimpan data statistik dinamis dari Laravel
  const [stats, setStats] = useState<DashboardStats>({
    total_vendor: 0,
    total_lelang: 0,
    total_tender: 0,
    total_non_tender: 0,
    total_rup: 0,
    total_kontrak: 0,
    total_daftar_hitam: 0,
    total_sanggahan: 0,
    total_penagihan: 0,
    total_pagu: 0,
    recent_lelang: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("eproc_user_role") || "1";
    setUserRole(role);
    try {
      const u = JSON.parse(localStorage.getItem("eproc_user") || "{}");
      setUserProfile(u);
    } catch (e) {}

    api
      .get<DashboardStats>("/dashboard/admin-stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data dashboard:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatRupiah = (val?: number) => {
    if (!val) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold group-[.mode--light]:text-white">
              Dashboard E-Procurement ACQUIRAS
            </div>
            <div className="text-sm text-slate-400 group-[.mode--light]:text-slate-200 mt-1">
              Selamat datang kembali, <strong>{userProfile.first_name || userProfile.username || "Pengguna"}</strong> (
              {userRole === "1" ? "Administrator & Pokja PBJ" : "Penyedia Barang / Jasa"})
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === "1" ? (
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard/master-lelang/add")}
                className="shadow-md flex items-center gap-2"
              >
                <Lucide icon="PlusCircle" className="w-4 h-4 stroke-[1.5]" />
                Buat Tender Baru
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard/lelang/daftar-lelang")}
                className="shadow-md flex items-center gap-2"
              >
                <Lucide icon="Search" className="w-4 h-4 stroke-[1.5]" />
                Lihat Tender Aktif
              </Button>
            )}
          </div>
        </div>

        {/* 4 Kartu Metrik Utama */}
        <div className="grid grid-cols-12 gap-5 mt-6">
          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked transition hover:shadow-lg">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50">
                <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70 flex items-center justify-center text-primary">
                  <Lucide icon="Building2" className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-semibold text-primary">
                  Penyedia (Vendor)
                </div>
                <div className="mt-0.5 text-xs text-slate-500">Rekanan Terverifikasi</div>
              </div>
            </div>
            <div className="px-4 py-3 mt-6 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-500">Total Vendor</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.total_vendor}
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate("/dashboard/master-data/master-vendor")}
                className="text-xs"
              >
                Detail
              </Button>
            </div>
          </div>

          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked transition hover:shadow-lg">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-success/80 rounded-full bg-slate-50">
                <div className="w-full h-full p-1 bg-white border rounded-full border-green-300 flex items-center justify-center text-success">
                  <Lucide icon="Gavel" className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-semibold text-success">
                  Paket Lelang
                </div>
                <div className="mt-0.5 text-xs text-slate-500">Pengadaan Terbuka</div>
              </div>
            </div>
            <div className="px-4 py-3 mt-6 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-500">Total Lelang</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.total_lelang}
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate(userRole === "1" ? "/dashboard/master-lelang" : "/dashboard/lelang/daftar-lelang")}
                className="text-xs"
              >
                Detail
              </Button>
            </div>
          </div>

          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked transition hover:shadow-lg">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-warning/80 rounded-full bg-slate-50">
                <div className="w-full h-full p-1 bg-white border rounded-full border-yellow-300 flex items-center justify-center text-warning">
                  <Lucide icon="FileBadge" className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-semibold text-warning">
                  Metode Tender
                </div>
                <div className="mt-0.5 text-xs text-slate-500">Tender Umum / Terbuka</div>
              </div>
            </div>
            <div className="px-4 py-3 mt-6 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-500">Total Tender</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.total_tender}
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-600 font-medium">
                Kompetitif
              </span>
            </div>
          </div>

          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked transition hover:shadow-lg">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-danger/80 rounded-full bg-slate-50">
                <div className="w-full h-full p-1 bg-white border rounded-full border-red-300 flex items-center justify-center text-danger">
                  <Lucide icon="FileCheck2" className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-semibold text-danger">
                  Non Tender
                </div>
                <div className="mt-0.5 text-xs text-slate-500">Pengadaan Langsung</div>
              </div>
            </div>
            <div className="px-4 py-3 mt-6 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs text-slate-500">Total Non Tender</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.total_non_tender}
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-600 font-medium">
                Langsung
              </span>
            </div>
          </div>
        </div>

        {/* Secondary KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-white dark:bg-darkmode-600 rounded-xl border border-slate-200/80 dark:border-darkmode-400">
            <div className="text-xs text-slate-500">Total Pagu Anggaran</div>
            <div className="text-lg font-bold text-primary mt-1">
              {formatRupiah(stats.total_pagu)}
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-darkmode-600 rounded-xl border border-slate-200/80 dark:border-darkmode-400">
            <div className="text-xs text-slate-500">Kontrak Pekerjaan</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {stats.total_kontrak} Kontrak
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-darkmode-600 rounded-xl border border-slate-200/80 dark:border-darkmode-400">
            <div className="text-xs text-slate-500">Masa Sanggah & Tanggapan</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {stats.total_sanggahan} Sanggahan
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-darkmode-600 rounded-xl border border-slate-200/80 dark:border-darkmode-400">
            <div className="text-xs text-slate-500">Daftar Hitam (Blacklist)</div>
            <div className="text-lg font-bold text-danger mt-1">
              {stats.total_daftar_hitam} Vendor Sanksi
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Chart & Daftar Lelang Terbaru Real */}
      <div className="col-span-12 xl:col-span-7">
        <div className="p-5 box box--stacked">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/60 dark:border-darkmode-400 gap-2">
            <div>
              <div className="text-base font-semibold">Grafik Distribusi Pengadaan</div>
              <div className="text-xs text-slate-500">Tender vs Non-Tender Tahun Anggaran 2026</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-primary mr-1.5"></span> Tender ({stats.total_tender})
              </span>
              <span className="flex items-center text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-1.5"></span> Non-Tender ({stats.total_non_tender})
              </span>
            </div>
          </div>
          <div className="mt-6">
            <ReportBarChart6 height={260} />
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-5">
        <div className="p-5 box box--stacked">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-darkmode-400">
            <div>
              <div className="text-base font-semibold">Paket Lelang Terkini</div>
              <div className="text-xs text-slate-500">Data lelang aktif langsung dari database</div>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(userRole === "1" ? "/dashboard/master-lelang" : "/dashboard/lelang/daftar-lelang")}
              className="text-xs"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-darkmode-400">
            {stats.recent_lelang && stats.recent_lelang.length > 0 ? (
              stats.recent_lelang.map((item: any) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-mono text-primary font-semibold">
                      {item.no_lelang}
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1">
                      {item.judul_lelang}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Pagu: {formatRupiah(item.paket?.nilai_pagu)} • {item.paket?.jenis_paket || "Tender"}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
                    {item.status || "Aktif"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Belum ada lelang aktif saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;