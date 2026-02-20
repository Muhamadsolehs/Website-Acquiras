import { useMemo, useState } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Progress from "@/components/Base/Progress";
import { Slideover } from "@/components/Base/Headless";
import paketFaker from "@/fakers/paket";

function Main() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState<number | "">(2024);
  const [status, setStatus] = useState<"all" | "progress" | "done" | "delayed">("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const data = useMemo(() => {
    return paketFaker.fakePaket().map((p, i) => ({
      ...p,
      vendor: `PT Vendor ${i + 1}`,
      startDate: new Date(Date.now() - (i + 1) * 1000 * 60 * 60 * 24 * 30),
      endDate: new Date(Date.now() + (10 - i) * 1000 * 60 * 60 * 24 * 30),
      progress: Math.min(100, 20 + i * 15 + (p.id % 7) * 3),
      status:
        i % 4 === 0 ? "done" : i % 4 === 1 ? "progress" : i % 4 === 2 ? "delayed" : "progress",
      milestones: [
        { title: "Persiapan", progress: Math.min(100, (i + 1) * 20) },
        { title: "Pelaksanaan", progress: Math.min(100, (i + 1) * 10 + 10) },
        { title: "Serah Terima", progress: Math.min(100, (i + 1) * 5 + 5) },
      ],
    }));
  }, []);

  const filtered = data.filter((d) => {
    if (year && d.tahun_anggaran !== year) return false;
    if (status !== "all" && d.status !== status) return false;
    if (q && !`${d.kode_paket} ${d.nama_paket} ${d.vendor}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const summary = useMemo(() => {
    return {
      total: filtered.length,
      progress: filtered.filter((f) => f.status === "progress").length,
      done: filtered.filter((f) => f.status === "done").length,
      delayed: filtered.filter((f) => f.status === "delayed").length,
    };
  }, [filtered]);

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium text-white">Progress Pekerjaan</div>
            <div className="text-sm text-slate-500 text-slate-100 mt-1">Lihat progress pekerjaan setelah lelang (pemenang/vendor)</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-3">
            <FormSelect value={year} onChange={(e) => setYear(Number(e.target.value) || "") }>
              <option value="">Semua Tahun</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </FormSelect>
          </div>

          <div className="col-span-3">
            <FormSelect value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="all">Semua Status</option>
              <option value="progress">Dalam Progres</option>
              <option value="done">Selesai</option>
              <option value="delayed">Tertunda</option>
            </FormSelect>
          </div>

          <div className="col-span-6">
            <div className="relative">
              <Lucide icon="Search" className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500" />
              <FormInput
                className="pl-9 rounded-[0.5rem]"
                placeholder="Cari paket, vendor..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-3 box box--stacked p-5">
            <div className="text-sm text-slate-500">Total Pekerjaan</div>
            <div className="mt-4 text-2xl font-bold">{summary.total}</div>
          </div>
          <div className="col-span-3 box box--stacked p-5">
            <div className="text-sm text-slate-500">Dalam Progres</div>
            <div className="mt-4 text-2xl font-bold">{summary.progress}</div>
          </div>
          <div className="col-span-3 box box--stacked p-5">
            <div className="text-sm text-slate-500">Selesai</div>
            <div className="mt-4 text-2xl font-bold">{summary.done}</div>
          </div>
          <div className="col-span-3 box box--stacked p-5">
            <div className="text-sm text-slate-500">Tertunda</div>
            <div className="mt-4 text-2xl font-bold">{summary.delayed}</div>
          </div>
        </div>

        <div className="mt-4 box p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">Daftar Pekerjaan</div>
            <div className="text-xs text-slate-400">Menampilkan {filtered.length} paket</div>
          </div>

          <div className="overflow-auto">
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">No</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Kode Paket</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Nama Paket</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Vendor</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Periode</Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Progress</Table.Td>
                  <Table.Td className="w-24 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">Aksi</Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map((f, idx) => (
                  <Table.Tr key={f.id} className="[&_td]:last:border-b-0">
                    <Table.Td className="py-4">{idx + 1}</Table.Td>
                    <Table.Td className="py-4">{f.kode_paket}</Table.Td>
                    <Table.Td className="py-4 max-w-[300px]">{f.nama_paket}</Table.Td>
                    <Table.Td className="py-4">{f.vendor}</Table.Td>
                    <Table.Td className="py-4">{new Date(f.startDate).toLocaleDateString()} - {new Date(f.endDate).toLocaleDateString()}</Table.Td>
                    <Table.Td className="py-4">
                      <div className="mb-2 text-xs text-slate-500">{f.progress}%</div>
                      <div className="w-full h-3 bg-slate-200 rounded overflow-hidden">
                        <Progress.Bar style={{ width: `${f.progress}%`, height: '100%' }}>{f.progress}%</Progress.Bar>
                      </div>
                    </Table.Td>
                    <Table.Td className="py-4 text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelected(f);
                          setOpenDetail(true);
                        }}
                      >
                        Detail
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>

      <Slideover open={openDetail} onClose={() => setOpenDetail(false)} size="lg">
        <Slideover.Panel>
          <Slideover.Title className="px-6 py-5">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="text-base font-medium">Detail Pekerjaan</div>
                <div className="text-xs text-slate-500">Informasi paket dan milestone</div>
              </div>
              <div>
                <Button variant="primary" onClick={() => setOpenDetail(false)}>Tutup</Button>
              </div>
            </div>
          </Slideover.Title>

          <Slideover.Description>
            {selected ? (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 box p-4">
                    <div className="text-sm text-slate-500">Kode Paket</div>
                    <div className="font-medium">{selected.kode_paket}</div>
                    <div className="text-sm text-slate-500 mt-3">Nama Paket</div>
                    <div className="font-medium">{selected.nama_paket}</div>
                  </div>

                  <div className="col-span-6 box p-4">
                    <div className="text-sm text-slate-500">Vendor</div>
                    <div className="font-medium">{selected.vendor}</div>
                    <div className="text-sm text-slate-500 mt-3">Periode</div>
                    <div className="font-medium">{new Date(selected.startDate).toLocaleDateString()} - {new Date(selected.endDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="box p-4">
                  <div className="text-sm text-slate-500 mb-2">Milestone</div>
                  <div className="space-y-3">
                    {selected.milestones.map((m: any, i: number) => (
                      <div key={i} className="flex items-center gap-x-4">
                        <div className="w-32 text-sm">{m.title}</div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1">{m.progress}%</div>
                          <div className="w-full h-3 bg-slate-200 rounded overflow-hidden">
                            <Progress.Bar style={{ width: `${m.progress}%`, height: '100%' }}>{m.progress}%</Progress.Bar>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="box p-4 text-right">
                  <div className="text-sm text-slate-500 inline-block mr-4">Status</div>
                  <div className="inline-block font-medium">{selected.status}</div>
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