import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import MainTable from "@/components/Table/Lelang/vendor";
import { useState, useEffect } from "react";
import api from "@/api/axiosinstance";

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
      console.error("Gagal mengambil data lelang:", err);
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
    const headers = ["No Lelang", "Kode Paket", "Nama Paket", "Jenis", "Status", "Pagu (Rp)", "Tgl Mulai", "Tgl Selesai"];
    const rows = dataToExport.map((d) => [
      `"${d.no_lelang || ""}"`,
      `"${d.paket?.kode_paket || ""}"`,
      `"${d.judul_lelang || d.paket?.nama_paket || ""}"`,
      `"${d.paket?.jenis_paket || "Tender"}"`,
      `"${d.status || ""}"`,
      d.paket?.nilai_pagu || d.paket?.nilai_pagu_paket || 0,
      `"${d.tanggal_mulai || ""}"`,
      `"${d.tanggal_selesai || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daftar_lelang_${jenisFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <Tab.Group>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div>
              <div className="text-base font-medium text-white">
                Daftar Lelang & Pengadaan
              </div>
              <div className="text-xs text-slate-300">
                Informasi paket pengadaan tender dan undangan non-tender yang dapat diikuti
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
                      placeholder="Cari lelang, kode paket..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 sm:w-64 rounded-[0.5rem]"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
                  <Button
                    variant="outline-secondary"
                    className="w-full sm:w-auto"
                    onClick={exportCSV}
                  >
                    <Lucide
                      icon="Download"
                      className="stroke-[1.3] w-4 h-4 mr-2"
                    />
                    Export CSV
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  Memuat data lelang...
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

