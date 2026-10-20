import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import MainTable from "@/components/Table/Lelang/pengumuman";
import { useState, useEffect } from "react";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

function Main() {
  const navigate = useNavigate();
  const [lelangList, setLelangList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<"tender" | "non tender">("tender");

  const fetchLelang = async () => {
    try {
      setLoading(true);
      const res = await api.get("/lelang");
      setLelangList(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data lelang pengumuman:", err);
      toast.error("Gagal memuat data lelang dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLelang();
  }, []);

  const searchFilteredData = lelangList.filter((item) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (item.no_lelang || "").toLowerCase().includes(s) ||
      (item.judul_lelang || "").toLowerCase().includes(s) ||
      (item.paket?.nama_paket || "").toLowerCase().includes(s) ||
      (item.paket?.kode_paket || "").toLowerCase().includes(s)
    );
  });

  const exportCSV = () => {
    const dataToExport = searchFilteredData.filter((item) => {
      const jenis = (item.paket?.jenis_paket || item.jenis_paket || "tender").toLowerCase();
      return jenis === jenisFilter.toLowerCase();
    });

    if (dataToExport.length === 0) {
      toast.warning("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["No Lelang", "Kode Paket", "Nama Paket", "Tahap", "Nilai Pagu", "Tanggal Dibuat / Mulai"];
    const rows = dataToExport.map((d) => [
      `"${d.no_lelang || ""}"`,
      `"${d.paket?.kode_paket || d.kode_paket || ""}"`,
      `"${d.judul_lelang || d.paket?.nama_paket || ""}"`,
      `"${d.status || d.paket?.tahap || "Pengumuman"}"`,
      d.paket?.nilai_pagu || 0,
      `"${d.tanggal_mulai || d.created_at || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pengumuman_lelang_${jenisFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Berhasil mengekspor data ke CSV");
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <Tab.Group>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div>
              <div className="text-base font-medium text-white">
                Tahap Pengumuman Lelang
              </div>
              <div className="text-xs text-slate-300">
                Daftar paket pengadaan dan lelang yang sedang berada dalam tahap pengumuman publik
              </div>
            </div>
          </div>
          <Tab.Panels className="mt-3.5 box flex flex-col box--stacked">
            <Tab.Panel>
              <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
                <div>
                  <div className="relative">
                    <Lucide
                      icon="Search"
                      className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                    />
                    <FormInput
                      type="text"
                      placeholder="Cari lelang / paket..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 sm:w-64 rounded-[0.5rem]"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
                  <Menu>
                    <Menu.Button
                      as={Button}
                      variant="outline-secondary"
                      className="w-full sm:w-auto"
                    >
                      <Lucide
                        icon="Download"
                        className="stroke-[1.3] w-4 h-4 mr-2"
                      />
                      Export
                      <Lucide
                        icon="ChevronDown"
                        className="stroke-[1.3] w-4 h-4 ml-2"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item onClick={exportCSV}>
                        <Lucide icon="FileSpreadsheet" className="w-4 h-4 mr-2" />
                        CSV
                      </Menu.Item>
                      <Menu.Item onClick={() => window.print()}>
                        <Lucide icon="Printer" className="w-4 h-4 mr-2" />
                        Cetak / PDF
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  Memuat data pengumuman lelang...
                </div>
              ) : (
                <MainTable
                  data={searchFilteredData}
                  jenisFilter={jenisFilter}
                  onJenisFilterChange={setJenisFilter}
                />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default Main;
