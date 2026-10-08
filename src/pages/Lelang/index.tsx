import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormSelect, FormLabel, FormTextarea } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axiosinstance";

interface PaketPengadaan {
  id: number;
  kode_paket: string;
  nama_paket: string;
  jenis_paket: string;
  nilai_pagu: number | string;
  nilai_hps: number | string;
}

interface LelangItem {
  id: number;
  paket_id: number;
  no_lelang: string;
  judul_lelang: string;
  deskripsi_lelang: string | null;
  tanggal_mulai: string;
  jam_mulai: string;
  tanggal_selesai: string;
  jam_selesai: string;
  status: string;
  paket?: PaketPengadaan;
  peserta?: any[];
}

function Main() {
  const navigate = useNavigate();
  const [data, setData] = useState<LelangItem[]>([]);
  const [pakets, setPakets] = useState<PaketPengadaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "tender" | "non tender">("all");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLelang, setSelectedLelang] = useState<LelangItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    paket_id: 0,
    no_lelang: "",
    judul_lelang: "",
    deskripsi_lelang: "",
    tanggal_mulai: new Date().toISOString().slice(0, 10),
    jam_mulai: "09:00",
    tanggal_selesai: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    jam_selesai: "17:00",
    status: "Aktif",
  });

  // Fetch Lelang & Paket
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resLelang, resPaket] = await Promise.all([
        api.get<LelangItem[]>("/lelang"),
        api.get<PaketPengadaan[]>("/paket-pengadaan"),
      ]);
      setData(resLelang.data || []);
      setPakets(resPaket.data || []);
    } catch (err) {
      console.error("Gagal memuat data lelang:", err);
      toast.error("Gagal memuat data lelang dari database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Lelang
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.no_lelang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul_lelang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.paket && item.paket.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTab =
        activeTab === "all" ||
        (item.paket && item.paket.jenis_paket?.toLowerCase() === activeTab);

      const matchStatus = !statusFilter || item.status === statusFilter;

      return matchSearch && matchTab && matchStatus;
    });
  }, [data, searchTerm, activeTab, statusFilter]);

  // Open Add
  const handleOpenAdd = () => {
    setIsEditing(false);
    const rand = Math.floor(100 + Math.random() * 900);
    const defaultPaketId = pakets.length > 0 ? pakets[0].id : 0;
    setFormData({
      id: 0,
      paket_id: defaultPaketId,
      no_lelang: `LLG-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${rand}`,
      judul_lelang: "",
      deskripsi_lelang: "",
      tanggal_mulai: new Date().toISOString().slice(0, 10),
      jam_mulai: "09:00",
      tanggal_selesai: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      jam_selesai: "17:00",
      status: "Aktif",
    });
    setModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (item: LelangItem) => {
    setIsEditing(true);
    setSelectedLelang(item);
    setFormData({
      id: item.id,
      paket_id: item.paket_id,
      no_lelang: item.no_lelang,
      judul_lelang: item.judul_lelang,
      deskripsi_lelang: item.deskripsi_lelang || "",
      tanggal_mulai: item.tanggal_mulai,
      jam_mulai: item.jam_mulai ? item.jam_mulai.slice(0, 5) : "09:00",
      tanggal_selesai: item.tanggal_selesai,
      jam_selesai: item.jam_selesai ? item.jam_selesai.slice(0, 5) : "17:00",
      status: item.status || "Aktif",
    });
    setModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paket_id) {
      toast.error("Silakan pilih paket pengadaan terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/lelang/${formData.id}`, formData);
        toast.success("Lelang berhasil diperbarui");
      } else {
        await api.post("/lelang", formData);
        toast.success("Paket lelang baru berhasil diterbitkan");
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Gagal menyimpan paket lelang");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedLelang) return;
    try {
      await api.delete(`/lelang/${selectedLelang.id}`);
      toast.success(`Lelang ${selectedLelang.no_lelang} berhasil dihapus`);
      setDeleteModalOpen(false);
      setSelectedLelang(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menghapus lelang");
    }
  };

  const formatRupiah = (val?: number | string) => {
    if (!val) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Header */}
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <div className="text-xl font-semibold group-[.mode--light]:text-white">
              Master Pelelangan
            </div>
            <div className="text-xs text-slate-400 group-[.mode--light]:text-slate-200">
              Pengelolaan pengumuman tender, pembukaan lelang, evaluasi rekanan & surat jalan
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              className="shadow-md flex items-center gap-2"
            >
              <Lucide icon="PlusCircle" className="w-4 h-4 stroke-[1.5]" />
              Tambah Lelang Baru
            </Button>
          </div>
        </div>

        {/* Card Main */}
        <div className="mt-5 box flex flex-col box--stacked">
          {/* Tabs Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-slate-200/60 dark:border-darkmode-400 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant={activeTab === "all" ? "primary" : "outline-secondary"}
                onClick={() => setActiveTab("all")}
                className="text-xs px-4"
              >
                Semua Lelang
              </Button>
              <Button
                variant={activeTab === "tender" ? "primary" : "outline-secondary"}
                onClick={() => setActiveTab("tender")}
                className="text-xs px-4"
              >
                Tender Terbuka
              </Button>
              <Button
                variant={activeTab === "non tender" ? "primary" : "outline-secondary"}
                onClick={() => setActiveTab("non tender")}
                className="text-xs px-4"
              >
                Non-Tender (Langsung)
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                />
                <FormInput
                  type="text"
                  placeholder="Cari lelang, kode paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-[0.5rem]"
                />
              </div>

              <FormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-36 rounded-[0.5rem]"
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Draft">Draft</option>
                <option value="Evaluasi">Evaluasi</option>
                <option value="Masa Sanggah">Masa Sanggah</option>
                <option value="Selesai">Selesai</option>
              </FormSelect>

              <Button
                variant="outline-secondary"
                onClick={fetchData}
                className="p-2"
                title="Segarkan Data"
              >
                <Lucide icon="RotateCw" className={clsx("w-4 h-4", { "animate-spin": loading })} />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table className="border-b border-slate-200/60">
              <Table.Thead>
                <Table.Tr>
                  <Table.Td className="w-12 py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    No
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Kode & Judul Lelang
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Paket Terkait
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Jenis
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Nilai HPS / Pagu
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Jadwal Pelaksanaan
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Status
                  </Table.Td>
                  <Table.Td className="w-28 py-4 font-medium text-center border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Aksi
                  </Table.Td>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Lucide icon="Loader2" className="w-5 h-5 animate-spin text-primary" />
                        <span>Memuat data lelang dari database...</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredData.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Lucide icon="Inbox" className="w-8 h-8 text-slate-400" />
                        <span>Belum ada data paket lelang. Silakan klik "Tambah Lelang Baru".</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <Table.Tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-darkmode-500">
                      <Table.Td className="py-4 border-dashed">{idx + 1}</Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {item.judul_lelang}
                        </div>
                        <div className="text-xs font-mono text-primary font-medium mt-0.5">
                          {item.no_lelang}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs">
                        {item.paket ? (
                          <div>
                            <div className="font-medium text-slate-700 dark:text-slate-200">
                              {item.paket.nama_paket}
                            </div>
                            <div className="text-slate-400 font-mono">{item.paket.kode_paket}</div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <span
                          className={clsx("px-2 py-0.5 rounded text-xs font-medium", {
                            "bg-primary/10 text-primary": item.paket?.jenis_paket === "tender",
                            "bg-amber-500/10 text-amber-600": item.paket?.jenis_paket === "non tender",
                          })}
                        >
                          {item.paket?.jenis_paket || "Tender"}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs font-medium">
                        <div className="text-slate-800 dark:text-slate-100">
                          {formatRupiah(item.paket?.nilai_hps || item.paket?.nilai_pagu)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Pagu: {formatRupiah(item.paket?.nilai_pagu)}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs">
                        <div>
                          {new Date(item.tanggal_mulai).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-slate-400">
                          s/d{" "}
                          {new Date(item.tanggal_selesai).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <span
                          className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", {
                            "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20":
                              item.status === "Aktif",
                            "bg-blue-500/10 text-blue-600 border border-blue-500/20":
                              item.status === "Masa Sanggah",
                            "bg-purple-500/10 text-purple-600 border border-purple-500/20":
                              item.status === "Evaluasi",
                            "bg-slate-100 text-slate-600 border border-slate-300":
                              item.status === "Draft",
                            "bg-teal-500/10 text-teal-600 border border-teal-500/20":
                              item.status === "Selesai",
                          })}
                        >
                          {item.status}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded hover:bg-slate-100 text-primary dark:hover:bg-darkmode-400"
                            title="Ubah Lelang"
                          >
                            <Lucide icon="PenLine" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLelang(item);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 text-danger dark:hover:bg-darkmode-400"
                            title="Hapus Lelang"
                          >
                            <Lucide icon="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </div>

          <div className="p-4 border-t border-slate-200/60 dark:border-darkmode-400 text-xs text-slate-500 flex justify-between items-center">
            <span>Total: <strong>{filteredData.length}</strong> lelang tercatat</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Lelang */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <Dialog.Panel className="p-6 sm:p-8 max-w-xl w-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-darkmode-400">
            <div className="text-lg font-semibold text-slate-800 dark:text-white">
              {isEditing ? "Perbarui Paket Lelang" : "Terbitkan Lelang Baru"}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <FormLabel>Pilih Paket Pengadaan<span className="text-red-500">*</span></FormLabel>
              <FormSelect
                value={formData.paket_id}
                onChange={(e) => {
                  const pid = Number(e.target.value);
                  const selectedPkt = pakets.find((p) => p.id === pid);
                  setFormData({
                    ...formData,
                    paket_id: pid,
                    judul_lelang: formData.judul_lelang || (selectedPkt ? `Lelang ${selectedPkt.nama_paket}` : ""),
                  });
                }}
                required
              >
                <option value={0} disabled>-- Pilih Paket Pengadaan --</option>
                {pakets.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.kode_paket}] {p.nama_paket} ({p.jenis_paket})
                  </option>
                ))}
              </FormSelect>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FormLabel>No. Lelang<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.no_lelang}
                  onChange={(e) => setFormData({ ...formData, no_lelang: e.target.value })}
                  placeholder="LLG-2026-..."
                  required
                />
              </div>

              <div>
                <FormLabel>Status Lelang</FormLabel>
                <FormSelect
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Aktif">Aktif (Buka Penawaran)</option>
                  <option value="Draft">Draft</option>
                  <option value="Evaluasi">Evaluasi Teknis & Harga</option>
                  <option value="Masa Sanggah">Masa Sanggah</option>
                  <option value="Selesai">Selesai (Pemenang Ditetapkan)</option>
                  <option value="Batal">Batal</option>
                </FormSelect>
              </div>
            </div>

            <div>
              <FormLabel>Judul Lelang<span className="text-red-500">*</span></FormLabel>
              <FormInput
                type="text"
                value={formData.judul_lelang}
                onChange={(e) => setFormData({ ...formData, judul_lelang: e.target.value })}
                placeholder="Pengadaan Cluster Server Baremetal..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>Tanggal Mulai<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  required
                />
              </div>
              <div>
                <FormLabel>Jam Mulai</FormLabel>
                <FormInput
                  type="time"
                  value={formData.jam_mulai}
                  onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>Tanggal Selesai<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="date"
                  value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  required
                />
              </div>
              <div>
                <FormLabel>Jam Selesai</FormLabel>
                <FormInput
                  type="time"
                  value={formData.jam_selesai}
                  onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <FormLabel>Deskripsi / Catatan Lelang</FormLabel>
              <FormTextarea
                rows={2}
                value={formData.deskripsi_lelang}
                onChange={(e) => setFormData({ ...formData, deskripsi_lelang: e.target.value })}
                placeholder="Rincian persyaratan, waktu pembukaan dokumen penawaran..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-darkmode-400">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Terbitkan Lelang"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Hapus */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Dialog.Panel className="p-6 max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <Lucide icon="AlertTriangle" className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Hapus Paket Lelang?
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Apakah Anda yakin ingin menghapus lelang <strong>{selectedLelang?.no_lelang}</strong>?
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Ya, Hapus
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default Main;
