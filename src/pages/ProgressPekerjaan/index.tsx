import { useState, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormTextarea } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Progress from "@/components/Base/Progress";
import { Slideover, Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

function Main() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Milestone Add Modal
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [submittingMilestone, setSubmittingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    judul_milestone: "",
    bobot_persen: 25,
    progress_persen: 0,
    status_milestone: "Belum Mulai",
    tanggal_target: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // Surat Jalan Modal
  const [suratJalanModalOpen, setSuratJalanModalOpen] = useState(false);
  const [suratJalanForm, setSuratJalanForm] = useState({
    no_surat_jalan: "",
    tanggal_surat_jalan: new Date().toISOString().split("T")[0],
  });

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/kontrak-pekerjaan");
      setContracts(res.data || []);
      if (selected) {
        const updated = (res.data || []).find((c: any) => c.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      console.error("Gagal memuat kontrak pekerjaan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("eproc_user");
    if (rawUser) {
      try {
        setCurrentUser(JSON.parse(rawUser));
      } catch (e) {}
    }
    fetchContracts();
  }, []);

  const userRole = localStorage.getItem("eproc_user_role") || (currentUser?.role !== undefined ? String(currentUser?.role) : "") || (currentUser?.role_id !== undefined ? String(currentUser?.role_id) : "");
  const isAdmin = userRole === "1" || currentUser?.role_name === "Admin" || currentUser?.role === 1 || currentUser?.role_id === 1 || currentUser?.role?.id === 1;

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    try {
      setSubmittingMilestone(true);
      await api.post("/pekerjaan-milestone", {
        kontrak_id: selected.id,
        judul_milestone: milestoneForm.judul_milestone,
        target_persen: Number(milestoneForm.bobot_persen),
        bobot_persen: Number(milestoneForm.bobot_persen),
        realisasi_persen: 0,
        progress_persen: 0,
        target_selesai: milestoneForm.tanggal_target,
        tanggal_target: milestoneForm.tanggal_target,
        status: "pending",
        status_milestone: "Belum Mulai",
      });

      toast.success("Milestone pekerjaan berhasil ditambahkan!");
      setMilestoneModalOpen(false);
      setMilestoneForm({
        judul_milestone: "",
        bobot_persen: 25,
        progress_persen: 0,
        status_milestone: "Belum Mulai",
        tanggal_target: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      fetchContracts();
    } catch (err: any) {
      toast.error("Gagal menambahkan milestone: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingMilestone(false);
    }
  };

  const handleUpdateMilestoneProgress = async (milestoneId: number, newProgress: number) => {
    try {
      const status = newProgress >= 100 ? "Selesai" : newProgress > 0 ? "Dalam Progres" : "Belum Mulai";
      await api.put(`/pekerjaan-milestone/${milestoneId}`, {
        realisasi_persen: newProgress,
        progress_persen: newProgress,
        status_milestone: status,
      });
      toast.success("Progress milestone diperbarui!");
      fetchContracts();
    } catch (err: any) {
      toast.error("Gagal memperbarui progress: " + (err.response?.data?.message || err.message));
    }
  };

  const handleIssueSuratJalan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    try {
      await api.put(`/kontrak-pekerjaan/${selected.id}`, {
        no_surat_jalan: suratJalanForm.no_surat_jalan,
        tanggal_surat_jalan: suratJalanForm.tanggal_surat_jalan,
        status_pekerjaan: "Pelaksanaan",
      });

      toast.success("Surat Jalan berhasil diterbitkan! Pekerjaan kini berstatus Pelaksanaan.");
      setSuratJalanModalOpen(false);
      fetchContracts();
    } catch (err: any) {
      toast.error("Gagal menerbitkan surat jalan: " + (err.response?.data?.message || err.message));
    }
  };

  const filtered = contracts.filter((c) => {
    const rawStatus = (c.status_pekerjaan || "Persiapan").toLowerCase();
    if (statusFilter !== "all") {
      const sf = statusFilter.toLowerCase();
      if (sf === "pelaksanaan" && !(rawStatus === "pelaksanaan" || rawStatus === "progress")) return false;
      if (sf === "selesai" && !(rawStatus === "selesai" || rawStatus === "done")) return false;
      if (sf === "persiapan" && rawStatus !== "persiapan") return false;
      if (sf !== "pelaksanaan" && sf !== "selesai" && sf !== "persiapan" && rawStatus !== sf) return false;
    }
    const s = q.toLowerCase();
    const contractNo = (c.nomor_kontrak || c.no_kontrak || "").toLowerCase();
    return (
      !s ||
      contractNo.includes(s) ||
      (c.paket?.nama_paket || "").toLowerCase().includes(s) ||
      (c.paket?.kode_paket || "").toLowerCase().includes(s) ||
      (c.vendor?.nama_perusahaan || "").toLowerCase().includes(s)
    );
  });

  const summary = {
    total: contracts.length,
    pelaksanaan: contracts.filter((c) => c.status_pekerjaan === "Pelaksanaan" || c.status_pekerjaan === "progress").length,
    selesai: contracts.filter((c) => c.status_pekerjaan === "Selesai" || c.status_pekerjaan === "done").length,
    persiapan: contracts.filter((c) => c.status_pekerjaan === "Persiapan" || !c.status_pekerjaan).length,
  };

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium text-white">Monitoring Progress Pekerjaan</div>
            <div className="text-sm text-slate-300 mt-1">
              Pantau pelaksanaan kontrak, penerbitan surat jalan, dan progres milestone penyedia/vendor
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-12 md:col-span-4">
            <FormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Semua Status Pekerjaan</option>
              <option value="Persiapan">Persiapan</option>
              <option value="Pelaksanaan">Pelaksanaan</option>
              <option value="Serah Terima">Serah Terima</option>
              <option value="Selesai">Selesai</option>
              <option value="Tertunda">Tertunda</option>
            </FormSelect>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="relative">
              <Lucide icon="Search" className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500" />
              <FormInput
                className="pl-9 rounded-[0.5rem]"
                placeholder="Cari nomor kontrak, nama paket, vendor..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Total Kontrak Berjalan</div>
            <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white">{summary.total}</div>
          </div>
          <div className="box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Dalam Pelaksanaan</div>
            <div className="mt-3 text-2xl font-bold text-primary">{summary.pelaksanaan}</div>
          </div>
          <div className="box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Tahap Persiapan</div>
            <div className="mt-3 text-2xl font-bold text-amber-500">{summary.persiapan}</div>
          </div>
          <div className="box box--stacked p-5">
            <div className="text-xs text-slate-500 font-medium uppercase">Pekerjaan Selesai</div>
            <div className="mt-3 text-2xl font-bold text-emerald-600">{summary.selesai}</div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 box box--stacked p-5">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              Memuat data kontrak dan progress...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      No
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      No Kontrak & Paket
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Penyedia / Vendor
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Nilai Kontrak (Rp)
                    </Table.Td>
                    <Table.Td className="w-48 py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Progress
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Surat Jalan
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Status
                    </Table.Td>
                    <Table.Td className="w-32 py-3.5 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Aksi
                    </Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filtered.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={8} className="py-8 text-center text-slate-500">
                        Tidak ada kontrak pekerjaan yang ditemukan.
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filtered.map((item, idx) => {
                      const progressVal = Number(item.progres_persen ?? item.progress_persen ?? 0);
                      const rawStatus = item.status_pekerjaan || "Persiapan";
                      const displayStatus = rawStatus === 'progress' ? 'Pelaksanaan' : rawStatus === 'done' ? 'Selesai' : rawStatus;
                      return (
                        <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                            {idx + 1}
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                            <div className="font-mono text-xs font-semibold text-primary">
                              {item.nomor_kontrak || item.no_kontrak || "-"}
                            </div>
                            <div className="font-medium text-slate-800 dark:text-white line-clamp-1 mt-0.5">
                              {item.paket?.nama_paket || "Paket Pengadaan"}
                            </div>
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-medium text-slate-700 dark:text-slate-300">
                            {item.vendor?.nama_perusahaan || `Vendor #${item.vendor_id}`}
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600">
                            Rp {Number(item.nilai_kontrak || 0).toLocaleString("id-ID")}
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                            <div className="flex items-center gap-2">
                              <div className="w-full">
                                <Progress className="h-2 rounded-full">
                                  <Progress.Bar
                                    className={progressVal >= 100 ? "bg-emerald-500" : "bg-primary"}
                                    role="progressbar"
                                    aria-valuenow={progressVal}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{ width: `${progressVal}%` }}
                                  />
                                </Progress>
                              </div>
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {progressVal}%
                              </span>
                            </div>
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-xs">
                            {item.no_surat_jalan ? (
                              <span className="text-emerald-600 font-medium flex items-center gap-1">
                                <Lucide icon="Check" className="w-3.5 h-3.5" />
                                {item.no_surat_jalan}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Belum terbit</span>
                            )}
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              (displayStatus === 'Selesai') ? 'bg-emerald-100 text-emerald-800' :
                              (displayStatus === 'Pelaksanaan') ? 'bg-blue-100 text-blue-800' :
                              (displayStatus === 'Serah Terima') ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {displayStatus}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-center">
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs px-2.5 py-1"
                              onClick={() => {
                                setSelected(item);
                                setOpenDetail(true);
                              }}
                            >
                              <Lucide icon="Eye" className="w-3.5 h-3.5 mr-1" />
                              Detail
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Slideover Detail */}
        <Slideover open={openDetail} onClose={() => setOpenDetail(false)}>
          <Slideover.Panel className="p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-darkmode-400">
              <Slideover.Title className="text-lg font-bold text-slate-800 dark:text-white">
                Detail Kontrak & Milestone
              </Slideover.Title>
              <button onClick={() => setOpenDetail(false)} className="text-slate-400 hover:text-slate-600">
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>

            {selected && (
              <div className="mt-5 space-y-6">
                <div>
                  <div className="text-xs text-slate-500 uppercase">Paket Pengadaan</div>
                  <div className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                    {selected.paket?.nama_paket}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    No Kontrak: {selected.nomor_kontrak || selected.no_kontrak || "-"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-darkmode-700 rounded-lg text-sm">
                  <div>
                    <span className="text-slate-500 text-xs">Penyedia:</span>
                    <div className="font-semibold text-slate-800 dark:text-white">
                      {selected.vendor?.nama_perusahaan}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Nilai Kontrak:</span>
                    <div className="font-semibold text-emerald-600">
                      Rp {Number(selected.nilai_kontrak || 0).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Tanggal Mulai:</span>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {selected.tanggal_mulai || "-"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Tanggal Selesai:</span>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {selected.tanggal_selesai || "-"}
                    </div>
                  </div>
                </div>

                {/* Surat Jalan Section */}
                <div className="p-4 border rounded-lg bg-slate-50/70 border-slate-200 dark:border-darkmode-400 dark:bg-darkmode-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                        <Lucide icon="Truck" className="w-3.5 h-3.5 text-primary" />
                        Surat Jalan Pekerjaan
                      </div>
                      <div className="font-bold text-slate-800 dark:text-white mt-1 text-sm flex items-center gap-2">
                        {selected.no_surat_jalan ? (
                          <span className="text-emerald-600 flex items-center gap-1.5 font-mono">
                            <Lucide icon="CheckCircle2" className="w-4 h-4" />
                            {selected.no_surat_jalan}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Surat Jalan Belum Diterbitkan</span>
                        )}
                      </div>
                      {selected.tanggal_surat_jalan && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          Tgl Terbit: <span className="font-medium text-slate-700 dark:text-slate-300">{selected.tanggal_surat_jalan}</span>
                        </div>
                      )}
                    </div>
                    {isAdmin && (
                      <Button
                        variant={selected.no_surat_jalan ? "outline-secondary" : "primary"}
                        size="sm"
                        className="text-xs shrink-0 self-start sm:self-center"
                        onClick={() => {
                          setSuratJalanForm({
                            no_surat_jalan: selected.no_surat_jalan || `SJ-${Date.now().toString().slice(-4)}/2026`,
                            tanggal_surat_jalan: selected.tanggal_surat_jalan || new Date().toISOString().split("T")[0],
                          });
                          setSuratJalanModalOpen(true);
                        }}
                      >
                        <Lucide icon={selected.no_surat_jalan ? "Edit3" : "Truck"} className="w-3.5 h-3.5 mr-1.5" />
                        {selected.no_surat_jalan ? "Ubah Surat Jalan" : "Terbitkan Surat Jalan"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                        Daftar Milestone Pekerjaan
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isAdmin ? "Atur tahapan pekerjaan dan bobot persen" : "Tahapan pelaksanaan pekerjaan kontrak"}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setMilestoneModalOpen(true)}
                      >
                        <Lucide icon="Plus" className="w-3.5 h-3.5 mr-1" />
                        Tambah Milestone
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const milestonesList = selected.milestone || selected.milestones || [];
                      if (milestonesList.length === 0) {
                        return (
                          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-darkmode-700 rounded">
                            Belum ada tahapan milestone yang dicatat.
                          </div>
                        );
                      }

                      return milestonesList.map((m: any, mIdx: number) => {
                        const bobot = Number(m.target_persen ?? m.bobot_persen ?? 0);
                        const progress = Number(m.realisasi_persen ?? m.progress_persen ?? 0);
                        const statusText = m.status === 'completed' || m.status_milestone === 'Selesai' || progress >= 100
                          ? 'Selesai'
                          : (m.status === 'in_progress' || m.status_milestone === 'Dalam Progres' || progress > 0
                              ? 'Dalam Progres'
                              : 'Belum Mulai');

                        return (
                          <div key={m.id || mIdx} className="p-3.5 bg-slate-50 dark:bg-darkmode-700 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-sm text-slate-800 dark:text-white">
                                  {m.judul_milestone}
                                </span>
                                {(m.target_selesai || m.tanggal_target) && (
                                  <div className="text-[11px] text-slate-400">
                                    Target: {m.target_selesai || m.tanggal_target}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                Bobot: {bobot}%
                              </span>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              <div className="flex-1">
                                <Progress className="h-2 rounded-full">
                                  <Progress.Bar
                                    className={progress >= 100 ? "bg-emerald-500" : "bg-primary"}
                                    role="progressbar"
                                    aria-valuenow={progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{ width: `${progress}%` }}
                                  />
                                </Progress>
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                                {progress}%
                              </span>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-darkmode-500 text-xs">
                              <span className="text-slate-500">
                                Status: <strong className="text-slate-700 dark:text-slate-300">{statusText}</strong>
                              </span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMilestoneProgress(m.id, Math.min(100, progress + 25))}
                                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition"
                                >
                                  +25%
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMilestoneProgress(m.id, 100)}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition"
                                >
                                  Selesai (100%)
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </Slideover.Panel>
        </Slideover>

        {/* Modal Tambah Milestone */}
        <Dialog open={milestoneModalOpen} onClose={() => setMilestoneModalOpen(false)} className="relative z-[70]">
          <Dialog.Panel className="p-6 w-full max-w-md mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <Dialog.Title className="text-base font-bold text-slate-800 dark:text-white">
                Tambah Milestone Pekerjaan
              </Dialog.Title>
              <button onClick={() => setMilestoneModalOpen(false)} className="text-slate-400">
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Nama / Tahapan Milestone *
                </label>
                <FormInput
                  type="text"
                  placeholder="Contoh: Pengadaan Material Tahap 1"
                  value={milestoneForm.judul_milestone}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, judul_milestone: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                    Bobot (%) *
                  </label>
                  <FormInput
                    type="number"
                    min="1"
                    max="100"
                    value={milestoneForm.bobot_persen}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, bobot_persen: Number(e.target.value) })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                    Target Selesai *
                  </label>
                  <FormInput
                    type="date"
                    value={milestoneForm.tanggal_target}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, tanggal_target: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                <Button type="button" variant="outline-secondary" onClick={() => setMilestoneModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" disabled={submittingMilestone}>
                  {submittingMilestone ? "Menyimpan..." : "Simpan Milestone"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </Dialog>

        {/* Modal Terbitkan Surat Jalan */}
        <Dialog open={suratJalanModalOpen} onClose={() => setSuratJalanModalOpen(false)} className="relative z-[70]">
          <Dialog.Panel className="p-6 w-full max-w-md mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <Dialog.Title className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Lucide icon="Truck" className="w-5 h-5 text-primary" />
                Penerbitan Surat Jalan
              </Dialog.Title>
              <button onClick={() => setSuratJalanModalOpen(false)} className="text-slate-400">
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSuratJalan} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Nomor Surat Jalan *
                </label>
                <FormInput
                  type="text"
                  value={suratJalanForm.no_surat_jalan}
                  onChange={(e) => setSuratJalanForm({ ...suratJalanForm, no_surat_jalan: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Tanggal Surat Jalan *
                </label>
                <FormInput
                  type="date"
                  value={suratJalanForm.tanggal_surat_jalan}
                  onChange={(e) => setSuratJalanForm({ ...suratJalanForm, tanggal_surat_jalan: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
                <Button type="button" variant="outline-secondary" onClick={() => setSuratJalanModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Terbitkan & Mulai Pelaksanaan
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
}

export default Main;