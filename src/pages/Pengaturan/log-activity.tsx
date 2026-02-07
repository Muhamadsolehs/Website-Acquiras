import { useMemo, useState } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { Slideover } from "@/components/Base/Headless";
import activitiesFaker from "@/fakers/activities";

function Main() {
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState<"all" | "today" | "7" | "30">("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const data = useMemo(() => activitiesFaker.fakeActivities(), []);

  const filtered = useMemo(() => {
    let out = data;

    if (q) {
      out = out.filter((d) =>
        `${d.activity} ${d.activityDetails || ""}`.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (status !== "all") {
      out = out.filter((d) => (d.statusBadge || "").toLowerCase() === status.toLowerCase());
    }

    if (period === "today") {
      out = out.slice(0, 3);
    } else if (period === "7") {
      out = out.slice(0, 7);
    } else if (period === "30") {
      out = out.slice(0, 12);
    }

    return out;
  }, [data, q, status, period]);

  const pageSize = 8;
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const getBadgeClass = (s?: string) => {
    if (!s) return "bg-slate-200 text-slate-800";
    const st = s.toLowerCase();
    return st.includes("success")
      ? "bg-emerald-500 text-white"
      : st.includes("completed")
      ? "bg-primary text-white"
      : st.includes("info")
      ? "bg-sky-500 text-white"
      : st.includes("new")
      ? "bg-amber-500 text-white"
      : "bg-slate-400 text-white";
  };

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium group-[.mode--light]:text-white">Log Activity</div>
            <div className="text-sm text-slate-500 group-[.mode--light]:text-slate-100 mt-1">Riwayat aktivitas pengguna dan sistem</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-3">
            <FormSelect value={period} onChange={(e) => setPeriod(e.target.value as any)}>
              <option value="all">Semua Periode</option>
              <option value="today">Hari Ini</option>
              <option value="7">7 Hari</option>
              <option value="30">30 Hari</option>
            </FormSelect>
          </div>

          <div className="col-span-3">
            <FormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Semua Status</option>
              <option value="Success">Success</option>
              <option value="Completed">Completed</option>
              <option value="Info">Info</option>
              <option value="New">New</option>
            </FormSelect>
          </div>

          <div className="col-span-6">
            <div className="relative">
              <Lucide icon="Search" className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500" />
              <input
                className="form-input pl-9 w-full rounded-[0.5rem]"
                placeholder="Cari aktivitas..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 box p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">Daftar Log</div>
            <div className="text-xs text-slate-400">Menampilkan {filtered.length} aktivitas</div>
          </div>

          <div className="overflow-auto">
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td className="w-24 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Tanggal</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Aktivitas</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Detail</Table.Td>
                  <Table.Td className="w-36 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Files / Images</Table.Td>
                  <Table.Td className="w-24 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Status</Table.Td>
                  <Table.Td className="w-24 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Aksi</Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paged.map((a, i) => (
                  <Table.Tr key={i} className="[&_td]:last:border-b-0">
                    <Table.Td className="py-4 text-sm">{a.date}</Table.Td>
                    <Table.Td className="py-4 font-medium">{a.activity}</Table.Td>
                    <Table.Td className="py-4 text-sm text-slate-500 max-w-[360px] truncate">{a.activityDetails || "-"}</Table.Td>
                    <Table.Td className="py-4 text-sm">
                      <div>{(a.uploadedFiles || []).length} file(s)</div>
                      <div className="mt-1 text-xs text-slate-400">{(a.images || []).length} image(s)</div>
                    </Table.Td>
                    <Table.Td className="py-4 text-center">
                      <div className={`inline-block px-2 py-[3px] text-xs rounded ${getBadgeClass(a.statusBadge)}`}>{a.statusBadge}</div>
                    </Table.Td>
                    <Table.Td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-x-2">
                        <Button size="sm" variant="outline-primary" onClick={() => { setSelected(a); setOpenDetail(true); }}>Detail</Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                <Pagination.Link>
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Pagination.Link>
                <Pagination.Link>...</Pagination.Link>
                <Pagination.Link>{page}</Pagination.Link>
                <Pagination.Link>{Math.min(totalPages, page + 1)}</Pagination.Link>
                <Pagination.Link>
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Pagination.Link>
              </Pagination>
            </div>

            <div className="text-xs text-slate-400">Halaman {page} dari {totalPages}</div>
          </div>
        </div>
      </div>

      <Slideover open={openDetail} onClose={() => setOpenDetail(false)} size="md">
        <Slideover.Panel>
          <Slideover.Title className="px-6 py-5">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-base font-medium">Detail Activity</div>
                <div className="text-xs text-slate-500">Rincian aktivitas</div>
              </div>
              <div>
                <Button variant="primary" onClick={() => setOpenDetail(false)}>Tutup</Button>
              </div>
            </div>
          </Slideover.Title>

          <Slideover.Description>
            {selected ? (
              <div className="space-y-4">
                <div className="box p-4">
                  <div className="text-sm text-slate-500">Tanggal</div>
                  <div className="font-medium">{selected.date}</div>

                  <div className="text-sm text-slate-500 mt-3">Aktivitas</div>
                  <div className="font-medium">{selected.activity}</div>

                  <div className="text-sm text-slate-500 mt-3">Detail</div>
                  <div className="text-sm text-slate-700">{selected.activityDetails || '-'}</div>
                </div>

                {selected.uploadedFiles && selected.uploadedFiles.length > 0 && (
                  <div className="box p-4">
                    <div className="text-sm text-slate-500 mb-2">Uploaded Files</div>
                    <div className="space-y-2">
                      {selected.uploadedFiles.map((f: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="text-sm">{f.filename}</div>
                          <div className="text-xs text-slate-400">{f.size}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.images && selected.images.length > 0 && (
                  <div className="box p-4">
                    <div className="text-sm text-slate-500 mb-2">Images</div>
                    <div className="grid grid-cols-3 gap-3">
                      {selected.images.map((src: string, idx: number) => (
                        <img key={idx} src={src} alt={`img-${idx}`} className="w-full h-24 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-right">
                  <div className={`inline-block px-3 py-1 text-sm rounded ${getBadgeClass(selected.statusBadge)}`}>{selected.statusBadge}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400">Tidak ada data</div>
            )}
          </Slideover.Description>

          <Slideover.Footer>
            <Button variant="primary" onClick={() => setOpenDetail(false)}>Tutup</Button>
          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>
    </div>
  );
}

export default Main;