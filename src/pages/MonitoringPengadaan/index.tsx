import Lucide from "@/components/Base/Lucide";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import ReportDonutChart from "@/components/ReportDonutChart";
import Table from "@/components/Base/Table";
import { useState, useEffect } from "react";
import api from "@/api/axiosinstance";

function Main() {
  const [viewType, setViewType] = useState<"nilai" | "paket" | "data">("nilai");
  const [rupList, setRupList] = useState<any[]>([]);
  const [paketList, setPaketList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rupRes, paketRes] = await Promise.all([
          api.get("/rup"),
          api.get("/paket-pengadaan"),
        ]);
        setRupList(rupRes.data || []);
        setPaketList(paketRes.data || []);
      } catch (err) {
        console.error("Gagal memuat monitoring pengadaan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRupValue = rupList.reduce((acc, r) => acc + Number(r.total_pagu || 0), 0);
  const totalPaketValue = paketList.reduce((acc, p) => acc + Number(p.nilai_pagu_paket || 0), 0);
  const totalPaketCount = paketList.length;
  const tenderPaketCount = paketList.filter((p) => (p.jenis_paket || "").toLowerCase() === "tender").length;
  const nonTenderPaketCount = paketList.filter((p) => (p.jenis_paket || "").toLowerCase() !== "tender").length;

  const persenPengisian = totalRupValue > 0 ? ((totalPaketValue / totalRupValue) * 100).toFixed(1) + "%" : "0%";

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium text-white">Profil & Monitoring Pengadaan</div>
            <div className="text-sm text-slate-300 mt-1">Live Monitoring RUP, Realisasi Anggaran, dan Paket Pengadaan Terintegrasi</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 sm:col-span-3">
            <FormSelect value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              <option value={2026}>Tahun Anggaran 2026</option>
              <option value={2025}>Tahun Anggaran 2025</option>
              <option value={2024}>Tahun Anggaran 2024</option>
            </FormSelect>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${viewType === "nilai" ? "bg-primary text-white" : "bg-slate-200 text-slate-800"}`}
            onClick={() => setViewType("nilai")}
          >
            Nilai Anggaran
          </Button>
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${viewType === "paket" ? "bg-primary text-white" : "bg-slate-200 text-slate-800"}`}
            onClick={() => setViewType("paket")}
          >
            Statistik Paket
          </Button>
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${viewType === "data" ? "bg-primary text-white" : "bg-slate-200 text-slate-800"}`}
            onClick={() => setViewType("data")}
          >
            Rincian Data
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 md:col-span-4 box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Realisasi Nilai Paket Pengadaan</div>
            <div className="mt-4 text-2xl font-bold text-emerald-600">
              Rp {totalPaketValue.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Berasal dari {totalPaketCount} paket pengadaan aktif
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Total Rencana Umum Pengadaan (RUP)</div>
            <div className="mt-4 text-2xl font-bold text-primary">
              Rp {totalRupValue.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Terdiri dari {rupList.length} pos pagu RUP terdaftar
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 box box--stacked p-5 flex flex-col items-center justify-center">
            <div className="text-xs text-slate-500 font-medium uppercase mb-2">% Realisasi Terhadap RUP</div>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-xl font-bold text-slate-800 dark:text-white">{persenPengisian}</div>
              </div>
              <ReportDonutChart width={140} height={140} />
            </div>
          </div>
        </div>

        {viewType === "data" ? (
          <div className="mt-6 box box--stacked p-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Daftar Paket Pengadaan Aktif
            </h3>
            <div className="overflow-x-auto">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="w-12 py-3 font-medium bg-slate-50 text-slate-500">No</Table.Td>
                    <Table.Td className="py-3 font-medium bg-slate-50 text-slate-500">Kode Paket</Table.Td>
                    <Table.Td className="py-3 font-medium bg-slate-50 text-slate-500">Nama Paket</Table.Td>
                    <Table.Td className="py-3 font-medium bg-slate-50 text-slate-500">Jenis</Table.Td>
                    <Table.Td className="py-3 font-medium bg-slate-50 text-slate-500">Satker</Table.Td>
                    <Table.Td className="py-3 font-medium bg-slate-50 text-slate-500">Nilai Pagu (Rp)</Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paketList.map((p, i) => (
                    <Table.Tr key={p.id || i}>
                      <Table.Td className="py-3 border-dashed">{i + 1}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-mono text-xs font-semibold text-primary">{p.kode_paket}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-medium text-slate-800 dark:text-white">{p.nama_paket}</Table.Td>
                      <Table.Td className="py-3 border-dashed capitalize">{p.jenis_paket || "Tender"}</Table.Td>
                      <Table.Td className="py-3 border-dashed text-slate-600">{p.satker?.nama_satker || "Satker Pengadaan"}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-semibold text-emerald-600">
                        Rp {Number(p.nilai_pagu_paket || 0).toLocaleString("id-ID")}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 md:col-span-6 box box--stacked p-5">
              <div className="text-sm font-bold text-slate-800 dark:text-white mb-4">Komposisi Metode Pengadaan</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Tender Terbuka</span>
                    <span>{tenderPaketCount} Paket ({totalPaketCount > 0 ? Math.round((tenderPaketCount / totalPaketCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${totalPaketCount > 0 ? (tenderPaketCount / totalPaketCount) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Non-Tender (Pengadaan Langsung / E-Purchasing)</span>
                    <span>{nonTenderPaketCount} Paket ({totalPaketCount > 0 ? Math.round((nonTenderPaketCount / totalPaketCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${totalPaketCount > 0 ? (nonTenderPaketCount / totalPaketCount) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 box box--stacked p-5">
              <div className="text-sm font-bold text-slate-800 dark:text-white mb-4">Ringkasan Pagu per Satuan Kerja</div>
              <div className="space-y-3">
                {rupList.slice(0, 4).map((r, idx) => (
                  <div key={r.id || idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-darkmode-700 rounded text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">{r.nama_paket_rup}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.kode_rup}</div>
                    </div>
                    <div className="font-bold text-primary">
                      Rp {Number(r.total_pagu || 0).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;