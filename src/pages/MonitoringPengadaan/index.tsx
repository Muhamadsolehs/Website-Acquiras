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

  // Filter berdasarkan tahun anggaran jika dipilih
  const filteredRup = rupList.filter((r) => !selectedYear || !r.tahun_anggaran || Number(r.tahun_anggaran) === selectedYear);
  const filteredPaket = paketList.filter((p) => !selectedYear || !p.tahun_anggaran || Number(p.tahun_anggaran) === selectedYear);

  // Ambil nilai_pagu dari RUP dan Paket Pengadaan (dukung fallback jika properti berbeda)
  const totalRupValue = filteredRup.reduce((acc, r) => acc + Number(r.nilai_pagu || r.total_pagu || 0), 0);
  const totalPaketValue = filteredPaket.reduce((acc, p) => acc + Number(p.nilai_pagu || p.nilai_pagu_paket || 0), 0);
  const totalPaketCount = filteredPaket.length;
  const tenderPaketCount = filteredPaket.filter((p) => (p.jenis_paket || "").toLowerCase() === "tender").length;
  const nonTenderPaketCount = filteredPaket.filter((p) => (p.jenis_paket || "").toLowerCase() !== "tender").length;

  const persenRealisasi = totalRupValue > 0 ? (totalPaketValue / totalRupValue) * 100 : 0;
  const persenPengisian = `${persenRealisasi.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-bold text-slate-800 dark:text-white">Profil & Monitoring Pengadaan</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live Monitoring RUP, Realisasi Anggaran, dan Paket Pengadaan Terintegrasi</div>
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

        {/* Tab Tombol Navigasi Tampilan */}
        <div className="mt-4 flex items-center gap-3">
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewType === "nilai" ? "bg-primary text-white shadow-sm" : "bg-white dark:bg-darkmode-600 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-darkmode-400"}`}
            onClick={() => setViewType("nilai")}
          >
            Nilai Anggaran
          </Button>
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewType === "paket" ? "bg-primary text-white shadow-sm" : "bg-white dark:bg-darkmode-600 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-darkmode-400"}`}
            onClick={() => setViewType("paket")}
          >
            Statistik Paket
          </Button>
          <Button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewType === "data" ? "bg-primary text-white shadow-sm" : "bg-white dark:bg-darkmode-600 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-darkmode-400"}`}
            onClick={() => setViewType("data")}
          >
            Rincian Data
          </Button>
        </div>

        {/* 3 Kartu KPI Utama */}
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 md:col-span-4 box box--stacked p-5 bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Realisasi Nilai Paket Pengadaan</div>
            <div className="mt-4 text-2xl font-bold text-emerald-600">
              Rp {totalPaketValue.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Berasal dari {totalPaketCount} paket pengadaan aktif
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 box box--stacked p-5 bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Rencana Umum Pengadaan (RUP)</div>
            <div className="mt-4 text-2xl font-bold text-primary">
              Rp {totalRupValue.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Terdiri dari {filteredRup.length} pos pagu RUP terdaftar
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 box box--stacked p-5 flex flex-col items-center justify-center bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">% Realisasi Terhadap RUP</div>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center z-10 flex-col">
                <div className="text-xl font-bold text-slate-800 dark:text-white">{persenPengisian}</div>
                <div className="text-[10px] text-slate-400">Terserap</div>
              </div>
              <ReportDonutChart width={140} height={140} />
            </div>
          </div>
        </div>

        {/* Tampilan Sesuai Tab View */}
        {viewType === "data" ? (
          <div className="mt-6 box box--stacked p-5 bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              Daftar Paket Pengadaan Aktif
            </h3>
            <div className="overflow-x-auto">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="w-12 py-3 font-semibold bg-slate-50 text-slate-600">No</Table.Td>
                    <Table.Td className="py-3 font-semibold bg-slate-50 text-slate-600">Kode Paket</Table.Td>
                    <Table.Td className="py-3 font-semibold bg-slate-50 text-slate-600">Nama Paket</Table.Td>
                    <Table.Td className="py-3 font-semibold bg-slate-50 text-slate-600">Jenis</Table.Td>
                    <Table.Td className="py-3 font-semibold bg-slate-50 text-slate-600">Satker</Table.Td>
                    <Table.Td className="py-3 font-semibold bg-slate-50 text-slate-600 text-right">Nilai Pagu (Rp)</Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPaket.map((p, i) => (
                    <Table.Tr key={p.id || i}>
                      <Table.Td className="py-3 border-dashed">{i + 1}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-mono text-xs font-semibold text-primary">{p.kode_paket}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-medium text-slate-800 dark:text-white">{p.nama_paket}</Table.Td>
                      <Table.Td className="py-3 border-dashed capitalize">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.jenis_paket === "tender" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"}`}>
                          {p.jenis_paket || "Tender"}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-3 border-dashed text-slate-600">{p.satker?.nama_satker || "Satker Pengadaan"}</Table.Td>
                      <Table.Td className="py-3 border-dashed font-semibold text-emerald-600 text-right">
                        Rp {Number(p.nilai_pagu || p.nilai_pagu_paket || 0).toLocaleString("id-ID")}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 md:col-span-6 box box--stacked p-5 bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
              <div className="text-sm font-bold text-slate-800 dark:text-white mb-4">Komposisi Metode Pengadaan</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Tender Terbuka</span>
                    <span>{tenderPaketCount} Paket ({totalPaketCount > 0 ? Math.round((tenderPaketCount / totalPaketCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-darkmode-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${totalPaketCount > 0 ? (tenderPaketCount / totalPaketCount) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    <span>Non-Tender (Pengadaan Langsung / E-Purchasing)</span>
                    <span>{nonTenderPaketCount} Paket ({totalPaketCount > 0 ? Math.round((nonTenderPaketCount / totalPaketCount) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-darkmode-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${totalPaketCount > 0 ? (nonTenderPaketCount / totalPaketCount) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 box box--stacked p-5 bg-white dark:bg-darkmode-600 rounded-xl shadow-sm border border-slate-200/60 dark:border-darkmode-400">
              <div className="text-sm font-bold text-slate-800 dark:text-white mb-4">Ringkasan Pagu per Satuan Kerja & RUP</div>
              <div className="space-y-3">
                {filteredRup.map((r, idx) => (
                  <div key={r.id || idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-darkmode-700 rounded-lg text-xs border border-slate-100 dark:border-darkmode-500">
                    <div className="pr-3">
                      <div className="font-semibold text-slate-800 dark:text-white text-xs">
                        {r.nama_kegiatan || r.nama_paket_rup || "Kegiatan RUP"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {r.kode_rup} {r.satker?.nama_satker ? `• ${r.satker.nama_satker}` : ""}
                      </div>
                    </div>
                    <div className="font-bold text-primary text-right whitespace-nowrap">
                      Rp {Number(r.nilai_pagu || r.total_pagu || 0).toLocaleString("id-ID")}
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