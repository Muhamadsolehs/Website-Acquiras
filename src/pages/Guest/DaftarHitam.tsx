import { useState, useEffect } from "react";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import api from "@/api/axiosinstance";

function GuestDaftarHitam() {
  const [blacklistList, setBlacklistList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        setLoading(true);
        const res = await api.get("/daftar-hitam");
        setBlacklistList(res.data || []);
      } catch (err) {
        console.error("Gagal memuat daftar hitam publik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlacklist();
  }, []);

  const filteredData = blacklistList.filter((item) => {
    const s = search.toLowerCase();
    return (
      !s ||
      (item.no_sk || "").toLowerCase().includes(s) ||
      (item.alasan || "").toLowerCase().includes(s) ||
      (item.vendor?.nama_perusahaan || "").toLowerCase().includes(s) ||
      (item.vendor?.npwp || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Daftar Hitam (Blacklist) Nasional & Penyedia
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Daftar penyedia yang dikenakan sanksi daftar hitam berdasarkan ketentuan hukum dan regulasi pengadaan.
        </p>
      </div>

      <div className="box box--stacked overflow-hidden p-5">
        <div className="flex flex-col p-2 sm:items-center sm:flex-row gap-y-2 mb-4">
          <div className="relative">
            <Lucide
              icon="Search"
              className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
            />
            <FormInput
              type="text"
              placeholder="Cari nama vendor, nomor SK, NPWP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-72 rounded-[0.5rem]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            Memuat daftar sanksi hitam...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 text-slate-500">No</Table.Td>
                  <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Nama Penyedia / Badan Usaha</Table.Td>
                  <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Nomor SK & Tgl</Table.Td>
                  <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Masa Berlaku Sanksi</Table.Td>
                  <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Alasan Sanksi</Table.Td>
                  <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Status</Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredData.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6} className="py-8 text-center text-slate-500">
                      Tidak ada catatan sanksi daftar hitam aktif saat ini.
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <Table.Td className="py-3.5 border-dashed">{idx + 1}</Table.Td>
                      <Table.Td className="py-3.5 border-dashed">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {item.vendor?.nama_perusahaan || `Vendor ID: ${item.vendor_id}`}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          NPWP: {item.vendor?.npwp || "-"}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-3.5 border-dashed">
                        <div className="font-mono text-xs font-semibold text-primary">{item.no_sk}</div>
                        <div className="text-xs text-slate-500">{item.tanggal_sk || "-"}</div>
                      </Table.Td>
                      <Table.Td className="py-3.5 border-dashed text-xs text-slate-700 dark:text-slate-300">
                        {item.masa_berlaku_mulai} s/d {item.masa_berlaku_selesai}
                      </Table.Td>
                      <Table.Td className="py-3.5 border-dashed text-sm text-slate-600 dark:text-slate-300 max-w-sm line-clamp-2">
                        {item.alasan}
                      </Table.Td>
                      <Table.Td className="py-3.5 border-dashed">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Aktif' ? 'bg-red-100 text-red-800' :
                          item.status === 'Dicabut' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {item.status}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestDaftarHitam;
