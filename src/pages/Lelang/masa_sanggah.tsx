import Lucide from "@/components/Base/Lucide";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import MainTable from "@/components/Table/Lelang/masa_sanggah";
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
      console.error("Gagal mengambil data lelang sanggah:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLelang();
  }, []);

  const filteredData = lelangList.filter((item) => {
    const jenis = (item.paket?.jenis_paket || "tender").toLowerCase();
    const matchesJenis = jenis === jenisFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      (item.no_lelang || "").toLowerCase().includes(s) ||
      (item.judul_lelang || "").toLowerCase().includes(s) ||
      (item.paket?.nama_paket || "").toLowerCase().includes(s);

    return matchesJenis && matchesSearch;
  });

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <Tab.Group>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div>
              <div className="text-base font-medium text-white">
                Tahap Masa Sanggah Lelang
              </div>
              <div className="text-xs text-slate-300">
                Fasilitas pengajuan dan evaluasi sanggahan hasil evaluasi / penetapan pemenang lelang
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
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  Memuat data masa sanggah...
                </div>
              ) : (
                <MainTable
                  data={filteredData}
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
