import { useState, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormTextarea } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

function Main() {
  const [blacklistList, setBlacklistList] = useState<any[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [form, setForm] = useState({
    vendor_id: "",
    no_sk: "",
    tanggal_sk: new Date().toISOString().split("T")[0],
    masa_berlaku_mulai: new Date().toISOString().split("T")[0],
    masa_berlaku_selesai: "",
    alasan: "",
    status: "Aktif",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resBl, resVn] = await Promise.all([
        api.get("/daftar-hitam"),
        api.get("/vendors"),
      ]);
      setBlacklistList(resBl.data || []);
      setVendorList(resVn.data || []);
    } catch (err) {
      console.error("Gagal memuat data daftar hitam:", err);
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
    fetchData();
  }, []);

  const isAdmin = currentUser?.role_id === 1 || currentUser?.role?.id === 1;

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setForm({
      vendor_id: vendorList[0]?.id || "",
      no_sk: `SK-DH-${Date.now().toString().slice(-4)}/2026`,
      tanggal_sk: new Date().toISOString().split("T")[0],
      masa_berlaku_mulai: new Date().toISOString().split("T")[0],
      masa_berlaku_selesai: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      alasan: "Wanprestasi / Tidak menyelesaikan kewajiban kontrak sesuai jadwal.",
      status: "Aktif",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setForm({
      vendor_id: item.vendor_id,
      no_sk: item.no_sk,
      tanggal_sk: item.tanggal_sk || "",
      masa_berlaku_mulai: item.masa_berlaku_mulai || "",
      masa_berlaku_selesai: item.masa_berlaku_selesai || "",
      alasan: item.alasan || "",
      status: item.status || "Aktif",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vendor_id) {
      toast.error("Pilih vendor yang akan dimasukkan ke daftar hitam");
      return;
    }

    try {
      setSubmitting(true);
      if (selectedItem) {
        await api.put(`/daftar-hitam/${selectedItem.id}`, form);
        toast.success("Data sanksi daftar hitam berhasil diperbarui!");
      } else {
        await api.post("/daftar-hitam", form);
        toast.success("Vendor berhasil dimasukkan ke daftar hitam (blacklist)!");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menyimpan data sanksi: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (item: any) => {
    if (!window.confirm(`Apakah Anda yakin ingin mencabut sanksi blacklist untuk vendor "${item.vendor?.nama_perusahaan}"?`)) {
      return;
    }
    try {
      await api.put(`/daftar-hitam/${item.id}`, { status: "Dicabut" });
      toast.success("Sanksi blacklist berhasil dicabut!");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal mencabut sanksi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus data sanksi blacklist ini secara permanen?")) return;
    try {
      await api.delete(`/daftar-hitam/${id}`);
      toast.success("Data berhasil dihapus");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus data: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredData = blacklistList.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    const s = search.toLowerCase();
    return (
      !s ||
      (item.no_sk || "").toLowerCase().includes(s) ||
      (item.alasan || "").toLowerCase().includes(s) ||
      (item.vendor?.nama_perusahaan || "").toLowerCase().includes(s) ||
      (item.vendor?.npwp || "").toLowerCase().includes(s)
    );
  });

  const exportCSV = () => {
    const headers = ["No SK", "Nama Vendor", "NPWP", "Tgl SK", "Masa Mulai", "Masa Selesai", "Alasan", "Status"];
    const rows = filteredData.map((d) => [
      `"${d.no_sk || ""}"`,
      `"${d.vendor?.nama_perusahaan || ""}"`,
      `"${d.vendor?.npwp || ""}"`,
      `"${d.tanggal_sk || ""}"`,
      `"${d.masa_berlaku_mulai || ""}"`,
      `"${d.masa_berlaku_selesai || ""}"`,
      `"${(d.alasan || "").replace(/"/g, '""')}"`,
      `"${d.status || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `daftar_hitam_vendor_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row justify-between">
          <div>
            <div className="text-base font-medium text-white">
              Daftar Hitam (Blacklist) Penyedia
            </div>
            <div className="text-xs text-slate-300">
              Daftar penyedia yang dikenakan sanksi daftar hitam berdasarkan ketentuan pengadaan
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline-secondary" className="!text-white border-white/20" onClick={exportCSV}>
              <Lucide icon="Download" className="w-4 h-4 mr-1.5" />
              Export CSV
            </Button>
            {isAdmin && (
              <Button variant="primary" className="bg-primary text-white" onClick={handleOpenAdd}>
                <Lucide icon="AlertOctagon" className="w-4 h-4 mr-1.5" />
                Tambah Daftar Hitam
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 box box--stacked p-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <Lucide icon="Search" className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500" />
              <FormInput
                type="text"
                placeholder="Cari nomor SK, vendor, NPWP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 sm:w-72 rounded-[0.5rem]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Filter Status:</label>
              <FormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
                <option value="Dicabut">Dicabut</option>
              </FormSelect>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <Lucide icon="Loader2" className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              Memuat data daftar hitam...
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
                      Nama Penyedia / Vendor
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Nomor SK & Tgl
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Masa Berlaku Sanksi
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Alasan Sanksi
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Status
                    </Table.Td>
                    {isAdmin && (
                      <Table.Td className="w-36 py-3.5 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                        Aksi
                      </Table.Td>
                    )}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredData.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-slate-500">
                        Tidak ada catatan daftar hitam yang sesuai kriteria.
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          {idx + 1}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {item.vendor?.nama_perusahaan || `Vendor ID: ${item.vendor_id}`}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            NPWP: {item.vendor?.npwp || "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <div className="font-medium text-slate-800 dark:text-white text-xs font-mono">
                            {item.no_sk}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {item.tanggal_sk || "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-xs">
                          <div className="font-medium text-slate-700 dark:text-slate-200">
                            {item.masa_berlaku_mulai} s/d {item.masa_berlaku_selesai}
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <div className="text-sm text-slate-700 dark:text-slate-300 max-w-xs line-clamp-2">
                            {item.alasan}
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'Aktif' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                            item.status === 'Dicabut' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                            'bg-slate-100 text-slate-800 dark:bg-darkmode-400 dark:text-slate-300'
                          }`}>
                            {item.status}
                          </span>
                        </Table.Td>
                        {isAdmin && (
                          <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="px-2 py-1 text-xs"
                                onClick={() => handleOpenEdit(item)}
                                title="Ubah Sanksi"
                              >
                                <Lucide icon="PenLine" className="w-3.5 h-3.5" />
                              </Button>
                              {item.status === 'Aktif' && (
                                <Button
                                  variant="soft-warning"
                                  size="sm"
                                  className="px-2 py-1 text-xs"
                                  onClick={() => handleRevoke(item)}
                                  title="Cabut Sanksi"
                                >
                                  <Lucide icon="ShieldOff" className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="soft-danger"
                                size="sm"
                                className="px-2 py-1 text-xs"
                                onClick={() => handleDelete(item.id)}
                                title="Hapus Data"
                              >
                                <Lucide icon="Trash2" className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </Table.Td>
                        )}
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add/Edit Blacklist */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lucide icon="AlertOctagon" className="w-5 h-5 text-danger" />
              {selectedItem ? "Ubah Sanksi Daftar Hitam" : "Penetapan Sanksi Daftar Hitam"}
            </Dialog.Title>
            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Pilih Penyedia / Vendor *
              </label>
              <FormSelect
                value={form.vendor_id}
                onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
                required
                className="mt-1"
                disabled={!!selectedItem}
              >
                <option value="" disabled>-- Pilih Vendor --</option>
                {vendorList.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nama_perusahaan} ({v.npwp})
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Nomor SK *
                </label>
                <FormInput
                  type="text"
                  value={form.no_sk}
                  onChange={(e) => setForm({ ...form, no_sk: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Tanggal SK *
                </label>
                <FormInput
                  type="date"
                  value={form.tanggal_sk}
                  onChange={(e) => setForm({ ...form, tanggal_sk: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Masa Berlaku Mulai *
                </label>
                <FormInput
                  type="date"
                  value={form.masa_berlaku_mulai}
                  onChange={(e) => setForm({ ...form, masa_berlaku_mulai: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Masa Berlaku Selesai *
                </label>
                <FormInput
                  type="date"
                  value={form.masa_berlaku_selesai}
                  onChange={(e) => setForm({ ...form, masa_berlaku_selesai: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Status Sanksi *
              </label>
              <FormSelect
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="mt-1"
              >
                <option value="Aktif">Aktif (Sedang Dikenakan Sanksi)</option>
                <option value="Selesai">Selesai (Masa Sanksi Telah Habis)</option>
                <option value="Dicabut">Dicabut (Sanksi Dibatalkan/Direhabilitasi)</option>
              </FormSelect>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Pelanggaran & Alasan Sanksi *
              </label>
              <FormTextarea
                rows={3}
                placeholder="Deskripsikan alasan penetapan blacklist, nomor kontrak bermasalah, atau kelalaian penyedia..."
                value={form.alasan}
                onChange={(e) => setForm({ ...form, alasan: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button type="button" variant="outline-secondary" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Sanksi"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default Main;
