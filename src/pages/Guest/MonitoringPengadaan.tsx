import MonitoringPengadaanContent from "@/pages/MonitoringPengadaan";

function GuestMonitoringPengadaan() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Monitoring Pengadaan
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Dashboard monitoring pengadaan dan RUP.
        </p>
      </div>

      <div className="box box--stacked overflow-hidden rounded-xl">
        <div className="rounded-b-xl bg-slate-800/95 p-6 dark:bg-darkmode-800">
          <MonitoringPengadaanContent />
        </div>
      </div>
    </div>
  );
}

export default GuestMonitoringPengadaan;
