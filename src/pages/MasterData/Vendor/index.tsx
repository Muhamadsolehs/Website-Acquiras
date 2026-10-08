import Lucide from "@/components/Base/Lucide";
import { Dialog } from "@/components/Base/Headless";
import { FormInput, FormSelect, FormLabel, FormTextarea } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import api from "@/api/axiosinstance";

interface VendorItem {
  id: number;
  user_id: number | null;
  id_vendor_code: string;
  nama_perusahaan: string;
  bentuk_usaha: string;
  status_cabang: number;
  npwp: string;
  kualifikasi: string;
  alamat: string;
  provinsi: string;
  kabupaten_kota: string;
  no_telepon: string;
  email_perusahaan: string;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
}

function Main() {
  const [data, setData] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kualifikasiFilter, setKualifikasiFilter] = useState("");
  const [bentukFilter, setBentukFilter] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    nama_perusahaan: "",
    bentuk_usaha: "PT",
    npwp: "",
    kualifikasi: "Kecil",
    alamat: "",
    provinsi: "DKI Jakarta",
    kabupaten_kota: "Jakarta Pusat",
    no_telepon: "",
    email_perusahaan: "",
  });

  // Fetch Vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await api.get<VendorItem[]>("/vendors");
      setData(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil data vendor:", err);
      toast.error("Gagal memuat data vendor dari database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return data.filter((v) => {
      const matchSearch =
        !searchTerm ||
        v.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id_vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.npwp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email_perusahaan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchKualifikasi = !kualifikasiFilter || v.kualifikasi === kualifikasiFilter;
      const matchBentuk = !bentukFilter || v.bentuk_usaha === bentukFilter;

      return matchSearch && matchKualifikasi && matchBentuk;
    });
  }, [data, searchTerm, kualifikasiFilter, bentukFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      nama_perusahaan: "",
      bentuk_usaha: "PT",
      npwp: "",
      kualifikasi: "Kecil",
      alamat: "",
      provinsi: "DKI Jakarta",
      kabupaten_kota: "Jakarta Pusat",
      no_telepon: "",
      email_perusahaan: "",
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v: VendorItem) => {
    setIsEditing(true);
    setSelectedVendor(v);
    setFormData({
      id: v.id,
      nama_perusahaan: v.nama_perusahaan,
      bentuk_usaha: v.bentuk_usaha || "PT",
      npwp: v.npwp,
      kualifikasi: v.kualifikasi || "Kecil",
      alamat: v.alamat || "",
      provinsi: v.provinsi || "",
      kabupaten_kota: v.kabupaten_kota || "",
      no_telepon: v.no_telepon || "",
      email_perusahaan: v.email_perusahaan || "",
    });
    setModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/vendors/${formData.id}`, formData);
        toast.success("Data vendor berhasil diperbarui");
      } else {
        await api.post("/vendors", formData);
        toast.success("Vendor baru berhasil ditambahkan");
      }

      setModalOpen(false);
      fetchVendors();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Gagal menyimpan data vendor");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Vendor
  const handleDelete = async () => {
    if (!selectedVendor) return;
    try {
      await api.delete(`/vendors/${selectedVendor.id}`);
      toast.success(`Vendor ${selectedVendor.nama_perusahaan} berhasil dihapus`);
      setDeleteModalOpen(false);
      setSelectedVendor(null);
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menghapus vendor");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ["ID", "Kode Vendor", "Nama Perusahaan", "Bentuk Usaha", "NPWP", "Kualifikasi", "Provinsi", "No Telepon", "Email"];
    const rows = filteredVendors.map((v) => [
      v.id,
      v.id_vendor_code,
      `"${v.nama_perusahaan}"`,
      v.bentuk_usaha,
      `"${v.npwp}"`,
      v.kualifikasi,
      `"${v.provinsi || "-"}"`,
      `"${v.no_telepon}"`,
      v.email_perusahaan,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Vendor_Acquiras_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data vendor berhasil diekspor");
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Header */}
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <div className="text-xl font-semibold group-[.mode--light]:text-white">
              Data Master Vendor
            </div>
            <div className="text-xs text-slate-400 group-[.mode--light]:text-slate-200">
              Kelola database penyedia barang & jasa, klasifikasi usaha, dan legalitas
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              className="shadow-md flex items-center gap-2"
            >
              <Lucide icon="PlusCircle" className="w-4 h-4 stroke-[1.5]" />
              Tambah Vendor Baru
            </Button>
          </div>
        </div>

        {/* Card Content */}
        <div className="mt-5 box flex flex-col box--stacked">
          {/* Filter Bar */}
          <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-4 border-b border-slate-200/60 dark:border-darkmode-400">
            <div className="relative flex-1 sm:max-w-xs">
              <Lucide
                icon="Search"
                className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
              />
              <FormInput
                type="text"
                placeholder="Cari vendor, kode, NPWP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-[0.5rem]"
              />
            </div>

            <div className="w-full sm:w-44">
              <FormSelect
                value={kualifikasiFilter}
                onChange={(e) => setKualifikasiFilter(e.target.value)}
                className="rounded-[0.5rem]"
              >
                <option value="">Semua Kualifikasi</option>
                <option value="Kecil">Kecil</option>
                <option value="Menengah">Menengah</option>
                <option value="Besar">Besar</option>
              </FormSelect>
            </div>

            <div className="w-full sm:w-44">
              <FormSelect
                value={bentukFilter}
                onChange={(e) => setBentukFilter(e.target.value)}
                className="rounded-[0.5rem]"
              >
                <option value="">Semua Bentuk Usaha</option>
                <option value="PT">PT</option>
                <option value="CV">CV</option>
                <option value="Koperasi">Koperasi</option>
                <option value="Firma">Firma</option>
                <option value="Perorangan">Perorangan</option>
              </FormSelect>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                variant="outline-secondary"
                onClick={fetchVendors}
                className="flex items-center gap-1.5"
                title="Segarkan Data"
              >
                <Lucide icon="RotateCw" className={clsx("w-4 h-4", { "animate-spin": loading })} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                variant="outline-secondary"
                onClick={exportToCSV}
                className="flex items-center gap-1.5"
              >
                <Lucide icon="Download" className="w-4 h-4" />
                <span>Export CSV</span>
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
                    Kode & Perusahaan
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Bentuk Usaha
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    NPWP
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Kualifikasi
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Domisili
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Kontak
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
                        <span>Memuat data vendor dari database...</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredVendors.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Lucide icon="Inbox" className="w-8 h-8 text-slate-400" />
                        <span>Tidak ada data vendor yang sesuai kriteria.</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredVendors.map((vendor, idx) => (
                    <Table.Tr key={vendor.id} className="hover:bg-slate-50/50 dark:hover:bg-darkmode-500">
                      <Table.Td className="py-4 border-dashed">{idx + 1}</Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {vendor.nama_perusahaan}
                        </div>
                        <div className="text-xs text-primary font-mono">{vendor.id_vendor_code}</div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-darkmode-400">
                          {vendor.bentuk_usaha}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed font-mono text-xs">{vendor.npwp}</Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <span
                          className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", {
                            "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300":
                              vendor.kualifikasi === "Kecil",
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300":
                              vendor.kualifikasi === "Menengah",
                            "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300":
                              vendor.kualifikasi === "Besar",
                          })}
                        >
                          {vendor.kualifikasi}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs">
                        <div>{vendor.kabupaten_kota || "-"}</div>
                        <div className="text-slate-400">{vendor.provinsi}</div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs">
                        <div>{vendor.no_telepon}</div>
                        <div className="text-slate-400">{vendor.email_perusahaan}</div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(vendor)}
                            className="p-1.5 rounded hover:bg-slate-100 text-primary dark:hover:bg-darkmode-400"
                            title="Ubah Data Vendor"
                          >
                            <Lucide icon="PenLine" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 text-danger dark:hover:bg-darkmode-400"
                            title="Hapus Vendor"
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
            <span>Total: <strong>{filteredVendors.length}</strong> vendor terdaftar</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Vendor */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <Dialog.Panel className="p-6 sm:p-8 max-w-xl w-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-darkmode-400">
            <div className="text-lg font-semibold text-slate-800 dark:text-white">
              {isEditing ? "Perbarui Data Vendor" : "Tambah Vendor Baru"}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FormLabel>Nama Perusahaan<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.nama_perusahaan}
                  onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                  placeholder="PT..."
                  required
                />
              </div>

              <div>
                <FormLabel>Bentuk Usaha<span className="text-red-500">*</span></FormLabel>
                <FormSelect
                  value={formData.bentuk_usaha}
                  onChange={(e) => setFormData({ ...formData, bentuk_usaha: e.target.value })}
                >
                  <option value="PT">PT (Perseroan Terbatas)</option>
                  <option value="CV">CV</option>
                  <option value="Koperasi">Koperasi</option>
                  <option value="Firma">Firma</option>
                  <option value="Perorangan">Perorangan</option>
                </FormSelect>
              </div>

              <div>
                <FormLabel>NPWP Perusahaan<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.npwp}
                  onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                  placeholder="00.000.000.0-000.000"
                  required
                />
              </div>

              <div>
                <FormLabel>Kualifikasi</FormLabel>
                <FormSelect
                  value={formData.kualifikasi}
                  onChange={(e) => setFormData({ ...formData, kualifikasi: e.target.value })}
                >
                  <option value="Kecil">Kecil</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Besar">Besar</option>
                </FormSelect>
              </div>

              <div>
                <FormLabel>No. Telepon<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.no_telepon}
                  onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                  placeholder="08123456789"
                  required
                />
              </div>

              <div>
                <FormLabel>Email Perusahaan<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="email"
                  value={formData.email_perusahaan}
                  onChange={(e) => setFormData({ ...formData, email_perusahaan: e.target.value })}
                  placeholder="office@perusahaan.com"
                  required
                />
              </div>

              <div>
                <FormLabel>Provinsi<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  placeholder="Jawa Barat"
                  required
                />
              </div>

              <div>
                <FormLabel>Kabupaten / Kota<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.kabupaten_kota}
                  onChange={(e) => setFormData({ ...formData, kabupaten_kota: e.target.value })}
                  placeholder="Bandung"
                  required
                />
              </div>
            </div>

            <div>
              <FormLabel>Alamat Lengkap<span className="text-red-500">*</span></FormLabel>
              <FormTextarea
                rows={2}
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Jl. Sukajadi No. 12"
                required
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
                {submitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Vendor"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Hapus Vendor */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Dialog.Panel className="p-6 max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <Lucide icon="AlertTriangle" className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Hapus Data Vendor?
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Apakah Anda yakin ingin menghapus data rekanan <strong>{selectedVendor?.nama_perusahaan}</strong>?
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
