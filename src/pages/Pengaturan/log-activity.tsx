import { useMemo, useState, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { Slideover } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";

function Main() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activity-logs");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Gagal memuat activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    let out = logs;

    if (q) {
      out = out.filter(
        (d) =>
          `${d.action || ""} ${d.module || ""} ${d.description || ""} ${d.user?.username || ""}`
            .toLowerCase()
            .includes(q.toLowerCase())
      );
    }

    if (moduleFilter !== "all") {
      out = out.filter((d) => (d.module || "").toLowerCase() === moduleFilter.toLowerCase());
    }

    return out;
  }, [logs, q, moduleFilter]);

  const pageSize = 10;
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium text-white">Log Aktivitas & Audit Trail</div>
            <div className="text-sm text-slate-300 mt-1">
              Catatan riwayat transaksi, otorisasi login, dan perubahan data sistem untuk kebutuhan audit
            </div>
          </div>
          <Button variant="outline-secondary" className="!text-white border-white/20" onClick={fetchLogs}>
            <Lucide icon="RefreshCw" className="w-4 h-4 mr-1.5" />
            Refresh Log
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 md:col-span-4">
            <FormSelect value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}>
              <option value="all">Semua Modul</option>
              <option value="AUTH">Autentikasi (AUTH)</option>
              <option value="USER">Manajemen Akun (USER)</option>
              <option value="VENDOR">Vendor Management</option>
              <option value="LELANG">Lelang & Tender</option>
              <option value="SANGGAHAN">Masa Sanggah</option>
              <option value="KONTRAK">Kontrak Pekerjaan</option>
            </FormSelect>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="relative">
              <Lucide icon="Search" className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500" />
              <FormInput
                className="pl-9 rounded-[0.5rem]"
                placeholder="Cari aktivitas, user, IP..."
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 box box--stacked p-5">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              Memuat audit log...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 text-slate-500">No</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Waktu</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Pengguna</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Modul</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Aksi</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">Deskripsi / Detail</Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 text-slate-500">IP Address</Table.Td>
                    <Table.Td className="w-24 py-3.5 font-medium text-center border-t bg-slate-50 text-slate-500">Aksi</Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paged.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={8} className="py-8 text-center text-slate-500">
                        Tidak ada log aktivitas yang tercatat.
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    paged.map((item, idx) => (
                      <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <Table.Td className="py-3.5 border-dashed">
                          {(page - 1) * pageSize + idx + 1}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed text-xs text-slate-500 whitespace-nowrap">
                          {item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "-"}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed">
                          <div className="font-semibold text-slate-800 dark:text-white text-xs">
                            {item.user?.username || `User #${item.user_id || "System"}`}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.user?.email || "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {item.module || "SYSTEM"}
                          </span>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed font-semibold text-xs text-primary">
                          {item.action}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {item.description || "-"}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed font-mono text-[11px] text-slate-500">
                          {item.ip_address || "127.0.0.1"}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed text-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="px-2 py-1 text-xs"
                            onClick={() => {
                              setSelected(item);
                              setOpenDetail(true);
                            }}
                          >
                            <Lucide icon="Eye" className="w-3.5 h-3.5" />
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/60">
              <span className="text-xs text-slate-500">
                Halaman {page} dari {totalPages} ({filtered.length} total log)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Slideover Detail */}
        <Slideover open={openDetail} onClose={() => setOpenDetail(false)}>
          <Slideover.Panel className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <Slideover.Title className="text-lg font-bold text-slate-800 dark:text-white">
                Rincian Audit Log
              </Slideover.Title>
              <button onClick={() => setOpenDetail(false)} className="text-slate-400 hover:text-slate-600">
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>

            {selected && (
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">Waktu Transaksi</span>
                  <div className="font-semibold text-slate-800 dark:text-white">
                    {new Date(selected.created_at).toLocaleString("id-ID")}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">Pengguna</span>
                  <div className="font-semibold text-slate-800 dark:text-white">
                    {selected.user?.username} ({selected.user?.email || "-"})
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">Modul & Aksi</span>
                  <div className="font-medium text-primary">
                    [{selected.module}] {selected.action}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">Deskripsi Lengkap</span>
                  <div className="p-3 bg-slate-50 dark:bg-darkmode-700 rounded text-slate-800 dark:text-white whitespace-pre-line">
                    {selected.description}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold">IP Address & User Agent</span>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
                    IP: {selected.ip_address || "127.0.0.1"}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 truncate">
                    UA: {selected.user_agent || "Antigravity Browser Client"}
                  </div>
                </div>
              </div>
            )}
          </Slideover.Panel>
        </Slideover>
      </div>
    </div>
  );
}

export default Main;