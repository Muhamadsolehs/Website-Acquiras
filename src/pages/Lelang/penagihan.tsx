import Lucide from "@/components/Base/Lucide";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import MainTable from "@/components/Table/Lelang/penagihan";
import { useState, useEffect } from "react";
import api from "@/api/axiosinstance";

function Main() {
  const navigate = useNavigate();
  const [contractList, setContractList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<"tender" | "non tender">("tender");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/kontrak-pekerjaan");
      setContractList(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data penagihan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = contractList.filter((item) => {
    const jenis = (item.paket?.jenis_paket || "tender").toLowerCase();
    const matchesJenis = jenis === jenisFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      (item.no_kontrak || "").toLowerCase().includes(s) ||
      (item.paket?.nama_paket || "").toLowerCase().includes(s) ||
      (item.vendor?.nama_perusahaan || "").toLowerCase().includes(s);

    return matchesJenis && matchesSearch;
  });

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <Tab.Group>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div>
              <div className="text-base font-medium text-white">
                Tahap Penagihan & Pembayaran (Invoicing)
              </div>
              <div className="text-xs text-slate-300">
                Pengajuan tagihan termin pembayaran pekerjaan dan penerbitan Surat Perintah Bayar (SPM)
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
                      placeholder="Cari kontrak, paket, vendor..."
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
                  Memuat data kontrak penagihan...
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
