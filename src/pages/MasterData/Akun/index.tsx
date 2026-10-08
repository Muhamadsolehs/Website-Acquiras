import Lucide from "@/components/Base/Lucide";
import { Menu, Dialog } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect, FormLabel, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import api from "@/api/axiosinstance";

interface Role {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  nama_perusahaan: string;
  npwp: string;
}

interface UserItem {
  id: number;
  role_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: number | boolean;
  created_at: string;
  role?: Role;
  vendor?: Vendor;
}

function Main() {
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    role_id: 2,
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: 1,
    nama_perusahaan: "",
    npwp: "",
    no_telepon: "",
  });

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<UserItem[]>("/users");
      setData(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      toast.error("Gagal memuat data akun dari database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Data
  const filteredUsers = useMemo(() => {
    return data.filter((u) => {
      const matchSearch =
        !searchTerm ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.first_name && u.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.vendor && u.vendor.nama_perusahaan.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = !roleFilter || u.role_id.toString() === roleFilter;
      const matchStatus =
        statusFilter === "" ||
        (statusFilter === "1" ? Boolean(u.is_active) : !Boolean(u.is_active));

      return matchSearch && matchRole && matchStatus;
    });
  }, [data, searchTerm, roleFilter, statusFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      role_id: 2,
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      is_active: 1,
      nama_perusahaan: "",
      npwp: "",
      no_telepon: "",
    });
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      id: user.id,
      role_id: user.role_id,
      username: user.username,
      email: user.email,
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      is_active: user.is_active ? 1 : 0,
      nama_perusahaan: user.vendor ? user.vendor.nama_perusahaan : "",
      npwp: user.vendor ? user.vendor.npwp : "",
      no_telepon: "",
    });
    setModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        const payload: any = {
          role_id: formData.role_id,
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          is_active: formData.is_active,
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        await api.put(`/users/${formData.id}`, payload);
        toast.success("Data akun berhasil diperbarui");
      } else {
        if (!formData.password) {
          toast.error("Password wajib diisi untuk akun baru");
          setSubmitting(false);
          return;
        }

        await api.post("/users", formData);
        toast.success("Akun baru berhasil ditambahkan");
      }

      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Submit error:", err);
      const msg = err?.response?.data?.message || "Gagal menyimpan data akun";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success(`Akun ${selectedUser.username} berhasil dihapus`);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menghapus akun");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Username", "Email", "Nama", "Role", "Status", "Tanggal Dibuat"];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.username,
      u.email,
      u.first_name || "-",
      u.role_id === 1 ? "Admin" : "Vendor",
      u.is_active ? "Aktif" : "Nonaktif",
      new Date(u.created_at).toLocaleDateString("id-ID"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Akun_Acquiras_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data berhasil diekspor ke CSV");
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Header */}
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <div className="text-xl font-semibold group-[.mode--light]:text-white">
              Data Master Akun
            </div>
            <div className="text-xs text-slate-400 group-[.mode--light]:text-slate-200">
              Kelola seluruh akun pengguna dan hak akses peran (Admin & Vendor)
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              className="shadow-md flex items-center gap-2"
            >
              <Lucide icon="PlusCircle" className="w-4 h-4 stroke-[1.5]" />
              Tambah Akun Baru
            </Button>
          </div>
        </div>

        {/* Card Main */}
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
                placeholder="Cari username, email, nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-[0.5rem]"
              />
            </div>

            <div className="w-full sm:w-44">
              <FormSelect
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-[0.5rem]"
              >
                <option value="">Semua Peran</option>
                <option value="1">Admin Pokja</option>
                <option value="2">Vendor Penyedia</option>
              </FormSelect>
            </div>

            <div className="w-full sm:w-44">
              <FormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-[0.5rem]"
              >
                <option value="">Semua Status</option>
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </FormSelect>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <Button
                variant="outline-secondary"
                onClick={fetchUsers}
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
                    Akun Pengguna
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Email
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Peran (Role)
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Terkait Vendor
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Status
                  </Table.Td>
                  <Table.Td className="py-4 font-medium border-t bg-slate-50 text-slate-500 dark:bg-darkmode-400">
                    Terdaftar
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
                        <span>Memuat data akun dari database...</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredUsers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Lucide icon="Inbox" className="w-8 h-8 text-slate-400" />
                        <span>Tidak ada data akun yang sesuai filter.</span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <Table.Tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-darkmode-500">
                      <Table.Td className="py-4 border-dashed">{idx + 1}</Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {user.first_name || user.username}
                        </div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">{user.email}</Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        {user.role_id === 1 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            Admin Pokja
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Vendor Penyedia
                          </span>
                        )}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        {user.vendor ? (
                          <div>
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                              {user.vendor.nama_perusahaan}
                            </span>
                            <span className="block text-xs text-slate-400">
                              NPWP: {user.vendor.npwp}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed">
                        {user.is_active ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-success/20 text-success">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-danger/20 text-danger">
                            Nonaktif
                          </span>
                        )}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-xs text-slate-500">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </Table.Td>
                      <Table.Td className="py-4 border-dashed text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded hover:bg-slate-100 text-primary dark:hover:bg-darkmode-400"
                            title="Ubah Akun"
                          >
                            <Lucide icon="PenLine" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 text-danger dark:hover:bg-darkmode-400"
                            title="Hapus Akun"
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
            <span>Total: <strong>{filteredUsers.length}</strong> akun terdaftar</span>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Akun */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <Dialog.Panel className="p-6 sm:p-8 max-w-lg w-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-darkmode-400">
            <div className="text-lg font-semibold text-slate-800 dark:text-white">
              {isEditing ? "Perbarui Akun Pengguna" : "Tambah Akun Baru"}
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
              <FormLabel>Peran (Role)<span className="text-red-500">*</span></FormLabel>
              <FormSelect
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
              >
                <option value={1}>Admin Pokja (Administrator Pengadaan)</option>
                <option value={2}>Vendor (Penyedia Barang / Jasa)</option>
              </FormSelect>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>Username<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>Nama Depan</FormLabel>
                <FormInput
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Nama Depan"
                />
              </div>
              <div>
                <FormLabel>Nama Belakang</FormLabel>
                <FormInput
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Nama Belakang"
                />
              </div>
            </div>

            <div>
              <FormLabel>
                Password {isEditing ? "(Kosongkan jika tidak diubah)" : <span className="text-red-500">*</span>}
              </FormLabel>
              <FormInput
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                required={!isEditing}
              />
            </div>

            {!isEditing && formData.role_id === 2 && (
              <div className="p-3 bg-slate-50 dark:bg-darkmode-700 rounded-lg border border-slate-200 dark:border-darkmode-400 space-y-3">
                <div className="text-xs font-semibold text-primary">Data Identitas Vendor</div>
                <div>
                  <FormLabel className="text-xs">Nama Perusahaan / Rekanan</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.nama_perusahaan}
                    onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                    placeholder="PT / CV..."
                  />
                </div>
                <div>
                  <FormLabel className="text-xs">NPWP Perusahaan</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.npwp}
                    onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                    placeholder="00.000.000.0-000.000"
                  />
                </div>
              </div>
            )}

            <div>
              <FormLabel>Status Akun</FormLabel>
              <FormSelect
                value={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Nonaktif (Diblokir)</option>
              </FormSelect>
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
                {submitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Akun"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Hapus Akun */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Dialog.Panel className="p-6 max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
            <Lucide icon="AlertTriangle" className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Hapus Akun Pengguna?
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.username}</strong>?
            Tindakan ini tidak dapat dibatalkan.
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
