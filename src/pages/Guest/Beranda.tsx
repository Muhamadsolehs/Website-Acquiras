import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import ReportDonutChart from "@/components/ReportDonutChart";
import ReportDonutChart2 from "@/components/ReportDonutChart2";
import ReportBarChart1 from "@/components/ReportBarChart1";
import ReportBarChart6 from "@/components/ReportBarChart6";
import ReportLineChart1 from "@/components/ReportLineChart1";
import api from "@/api/axiosinstance";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl } from "@/config/blockchain";

function GuestBeranda() {
  const [stats, setStats] = useState<any>({
    total_lelang: 0,
    lelang_aktif: 0,
    total_vendor: 0,
    total_pagu: 0,
    persentase_rup: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/admin-stats");
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik beranda:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000000) {
      return `Rp ${(val / 1000000000000).toFixed(2)} T`;
    } else if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(2)} M`;
    } else if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(2)} Jt`;
    }
    return `Rp ${Number(val || 0).toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-1 via-theme-1/95 to-theme-2 p-8 shadow-xl md:p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm md:text-4xl">
            Selamat Datang di ACQUIRAS
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            Sistem informasi pengadaan dan lelang terintegrasi. Pantau statistik anggaran, daftar lelang aktif, dan ikuti tender secara digital.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/daftar-lelang"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-theme-1 shadow-md transition hover:bg-white/95"
            >
              <Lucide icon="List" className="h-4 w-4" />
              Daftar Lelang
            </Link>
            <Link
              to="/daftar-hitam"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Lucide icon="ShieldOff" className="h-4 w-4" />
              Daftar Hitam
            </Link>
            <Link
              to="/monitoring-pengadaan"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Lucide icon="Activity" className="h-4 w-4" />
              Monitoring Pengadaan
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition"
            >
              <Lucide icon="UserPlus" className="h-4 w-4" />
              Daftar Sebagai Penyedia
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-20">
          <div className="h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
      </section>

      {/* Stat cards from live database */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Lucide icon="FileText" className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
            {loading ? "..." : stats.total_lelang || 0}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Total Paket Lelang</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10">
            <Lucide icon="TrendingUp" className="h-5 w-5 text-success" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
            {loading ? "..." : stats.lelang_aktif || 0}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lelang Aktif</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10">
            <Lucide icon="Users" className="h-5 w-5 text-warning" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
            {loading ? "..." : stats.total_vendor || 0}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vendor Terdaftar</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-theme-1/10">
            <Lucide icon="Wallet" className="h-5 w-5 text-theme-1" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
            {loading ? "..." : formatCurrency(stats.total_pagu || 0)}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nilai Pengadaan</div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Distribusi Realisasi RUP
          </h3>
          <p className="mt-1 text-sm text-slate-500">Persentase paket terhadap pagu RUP</p>
          <div className="mt-6 flex justify-center">
            <div className="relative h-52 w-52">
              <ReportDonutChart width={208} height={208} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  {stats.persentase_rup || 100}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Kategori Lelang
          </h3>
          <p className="mt-1 text-sm text-slate-500">Tender vs Non Tender</p>
          <div className="mt-6 h-52 w-full">
            <ReportDonutChart2 width="auto" height={208} />
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Aktivitas Pengadaan
          </h3>
          <p className="mt-1 text-sm text-slate-500">Distribusi paket berjalan</p>
          <div className="mt-6 h-64 w-full">
            <ReportBarChart1 width="auto" height={256} />
          </div>
        </div>

        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Tren Nilai Kontrak
          </h3>
          <p className="mt-1 text-sm text-slate-500">Pergerakan alokasi anggaran belanja</p>
          <div className="mt-6 h-64 w-full">
            <ReportLineChart1 width="auto" height={256} />
          </div>
        </div>
      </div>

      {/* Web3 Blockchain Transparency Section */}
      <div className="box box--stacked overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Lucide icon="ShieldCheck" className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ethereum Sepolia Smart Contract Verified</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Sistem Anti-Tamper & Verifikasi Dokumen Digital ACQUIRAS
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Setiap pengumuman lelang, berkas penawaran harga vendor, penetapan pemenang, hingga tanda tangan elektronik (TTE) dokumen pengadaan disegel menggunakan algoritma hash kriptografi SHA-256 yang divalidasi langsung ke blockchain terdesentralisasi.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>Contract:</span>
              <a
                href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>{formatAddress(BLOCKCHAIN_CONFIG.contractAddress)}</span>
                <Lucide icon="ExternalLink" className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <a
              href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-sm font-semibold text-white transition-all shadow-md"
            >
              <Lucide icon="Globe" className="w-4 h-4 text-indigo-300" />
              <span>Lihat Ledger Sepolia</span>
              <Lucide icon="ExternalLink" className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestBeranda;
