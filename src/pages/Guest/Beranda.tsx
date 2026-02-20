import { Link } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import ReportDonutChart from "@/components/ReportDonutChart";
import ReportDonutChart2 from "@/components/ReportDonutChart2";
import ReportBarChart1 from "@/components/ReportBarChart1";
import ReportBarChart6 from "@/components/ReportBarChart6";
import ReportLineChart1 from "@/components/ReportLineChart1";

function GuestBeranda() {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-1 via-theme-1/95 to-theme-2 p-8 shadow-xl md:p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm md:text-4xl">
            Selamat Datang di ACQUIRAS
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            Sistem informasi pengadaan dan lelang. Pantau statistik, daftar lelang, dan monitoring pengadaan di satu tempat.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/guest/daftar-lelang"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-theme-1 shadow-md transition hover:bg-white/95"
            >
              <Lucide icon="List" className="h-4 w-4" />
              Daftar Lelang
            </Link>
            <Link
              to="/guest/daftar-hitam"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Lucide icon="ShieldOff" className="h-4 w-4" />
              Daftar Hitam
            </Link>
            <Link
              to="/guest/monitoring-pengadaan"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Lucide icon="Activity" className="h-4 w-4" />
              Monitoring Pengadaan
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-20">
          <div className="h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Lucide icon="FileText" className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">1.248</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Total Paket Lelang</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10">
            <Lucide icon="TrendingUp" className="h-5 w-5 text-success" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">89</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lelang Aktif</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10">
            <Lucide icon="Users" className="h-5 w-5 text-warning" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">3.521</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vendor Terdaftar</div>
        </div>
        <div className="box box--stacked flex flex-col rounded-xl p-5 transition hover:shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-theme-1/10">
            <Lucide icon="Wallet" className="h-5 w-5 text-theme-1" />
          </div>
          <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">Rp 1,09 T</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nilai Pengadaan</div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Distribusi RUP
          </h3>
          <p className="mt-1 text-sm text-slate-500">Persentase pengisian RUP</p>
          <div className="mt-6 flex justify-center">
            <div className="relative h-52 w-52">
              <ReportDonutChart width={208} height={208} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                  109%
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
            Aktivitas Mingguan
          </h3>
          <p className="mt-1 text-sm text-slate-500">Paket lelang per hari</p>
          <div className="mt-6 h-64 w-full">
            <ReportBarChart1 width="auto" height={256} />
          </div>
        </div>

        <div className="box box--stacked overflow-hidden rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">
            Tren Pengadaan
          </h3>
          <p className="mt-1 text-sm text-slate-500">Nilai kontrak 12 bulan</p>
          <div className="mt-6 h-64 w-full">
            <ReportLineChart1 width="auto" height={256} />
          </div>
        </div>
      </div>

      {/* Chart full width */}
      <div className="box box--stacked overflow-hidden rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">
          Perbandingan Paket per Kategori
        </h3>
        <p className="mt-1 text-sm text-slate-500">Tender vs Non Tender per periode</p>
        <div className="mt-6 h-72 w-full">
          <ReportBarChart6 width="auto" height={288} />
        </div>
      </div>
    </div>
  );
}

export default GuestBeranda;
