import { useState, useEffect } from "react";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import MainTableLelangVendor from "@/components/Table/Lelang/vendor";
import api from "@/api/axiosinstance";

function GuestDaftarLelang() {
  const [lelangList, setLelangList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<"tender" | "non tender">("tender");

  useEffect(() => {
    const fetchLelang = async () => {
      try {
        setLoading(true);
        const res = await api.get("/lelang");
        setLelangList(res.data || []);
      } catch (err) {
        console.error("Gagal memuat lelang publik:", err);
      } finally {
        setLoading(false);
      }
    };
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

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Daftar Pengumuman Lelang & Tender
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Daftar paket pengadaan barang & jasa terbuka yang dapat diikuti oleh penyedia terdaftar.
        </p>
      </div>

      <div className="box box--stacked overflow-hidden">
        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2 border-b border-slate-200/60">
          <div className="relative">
            <Lucide
              icon="Search"
              className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
            />
            <FormInput
              type="text"
              placeholder="Cari lelang, paket, kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-72 rounded-[0.5rem]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            Memuat pengumuman lelang...
          </div>
        ) : (
          <MainTableLelangVendor
            data={searchFilteredData}
            jenisFilter={jenisFilter}
            onJenisFilterChange={setJenisFilter}
          />
        )}
      </div>
    </div>
  );
}

export default GuestDaftarLelang;
