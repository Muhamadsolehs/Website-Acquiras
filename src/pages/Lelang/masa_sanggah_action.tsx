import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormTextarea } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

const MasaSanggahAction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [lelang, setLelang] = useState<any>(null);
  const [sanggahanList, setSanggahanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    noSurat: "",
    tanggalSanggah: new Date().toISOString().split("T")[0],
    alasanSanggah: "",
    fileDokumentasi: "dokumen_bukti_sanggahan.pdf",
  });

  // Admin Review / Response Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSanggahan, setSelectedSanggahan] = useState<any>(null);
  const [reviewStatus, setReviewStatus] = useState("diterima");
  const [jawabanSanggah, setJawabanSanggah] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lelangRes, sanggahanRes] = await Promise.all([
        api.get(`/lelang/${id}`),
        api.get(`/sanggahan?lelang_id=${id}`),
      ]);
      setLelang(lelangRes.data);
      setSanggahanList(sanggahanRes.data || []);
    } catch (err: any) {
      toast.error("Gagal memuat data sanggahan: " + (err.response?.data?.message || err.message));
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
    if (id) {
      fetchData();
    }
  }, [id]);

  const isAdmin = currentUser?.role_id === 1 || currentUser?.role?.id === 1;

  const handleSubmitSanggahan = async (e: React.FormEvent) => {
    e.preventDefault();
    const vendorId = currentUser?.vendor?.id || 1;

    try {
      setSubmitting(true);
      await api.post("/sanggahan", {
        lelang_id: id,
        vendor_id: vendorId,
        no_surat: formData.noSurat,
        tanggal_sanggah: formData.tanggalSanggah,
        alasan_sanggah: formData.alasanSanggah,
        file_dokumentasi: formData.fileDokumentasi,
        status: "baru",
      });

      toast.success("Sanggahan berhasil diajukan ke Pokja Pemilihan!");
      setShowSubmitModal(false);
      setFormData({
        noSurat: "",
        tanggalSanggah: new Date().toISOString().split("T")[0],
        alasanSanggah: "",
        fileDokumentasi: "dokumen_bukti_sanggahan.pdf",
      });
      fetchData();
    } catch (err: any) {
      toast.error("Gagal mengajukan sanggahan: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateJawabanSanggahan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSanggahan) return;

    try {
      setSubmitting(true);
      await api.put(`/sanggahan/${selectedSanggahan.id}`, {
        status: reviewStatus,
        jawaban_sanggah: jawabanSanggah,
      });

      toast.success("Keputusan & balasan sanggahan berhasil disimpan!");
      setReviewModalOpen(false);
      setSelectedSanggahan(null);
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menyimpan jawaban: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (item: any) => {
    setSelectedSanggahan(item);
    setReviewStatus(item.status || "sedang_ditinjau");
    setJawabanSanggah(item.jawaban_sanggah || "");
    setReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Lucide icon="Loader2" className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
        Memuat data sanggahan...
      </div>
    );
  }

  const paket = lelang?.paket || {};

  return (
    <div className="px-6 py-8">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline-secondary"
                size="sm"
                className="!text-white border-white/20"
                onClick={() => navigate(-1)}
              >
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-1" />
                Kembali
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Masa Sanggah Lelang
              </h1>
            </div>
            <p className="text-slate-300 mt-1">
              Paket: <span className="font-semibold text-white">{lelang?.judul_lelang || paket.nama_paket}</span> ({lelang?.no_lelang})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-primary text-white"
              onClick={() => setShowSubmitModal(true)}
            >
              <Lucide icon="ShieldAlert" className="w-4 h-4 mr-2" />
              Ajukan Sanggahan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500">Nilai Pagu Paket</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              Rp {Number(paket.nilai_pagu_paket || 0).toLocaleString("id-ID")}
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500">Total Sanggahan Masuk</div>
            <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
              {sanggahanList.length} Berkas
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500">Sanggahan Diterima</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              {sanggahanList.filter((s) => s.status === "diterima").length}
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500">Sanggahan Ditolak</div>
            <div className="text-xl font-bold text-danger mt-1">
              {sanggahanList.filter((s) => s.status === "ditolak").length}
            </div>
          </div>
        </div>
      </div>

      {/* Sanggahan Table */}
      <div className="box box--stacked p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Daftar Berkas Sanggahan
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table className="border-b border-slate-200/60">
            <Table.Thead>
              <Table.Tr>
                <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  No
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Nomor Surat
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Penyedia / Vendor
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Tgl Sanggah
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Substansi / Alasan Sanggah
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Status
                </Table.Td>
                <Table.Td className="w-40 py-3.5 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Aksi
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sanggahanList.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} className="py-8 text-center text-slate-500">
                    Belum ada sanggahan yang masuk untuk paket pengadaan ini.
                  </Table.Td>
                </Table.Tr>
              ) : (
                sanggahanList.map((item, idx) => (
                  <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                      {idx + 1}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-mono text-xs font-semibold text-primary">
                      {item.no_surat}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-semibold text-slate-800 dark:text-white">
                      {item.vendor?.nama_perusahaan || `Vendor #${item.vendor_id}`}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-xs text-slate-500">
                      {item.tanggal_sanggah}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                      <div className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2">
                        {item.alasan_sanggah}
                      </div>
                      {item.jawaban_sanggah && (
                        <div className="mt-1 text-xs text-slate-500 italic bg-slate-100 dark:bg-darkmode-700 p-1.5 rounded">
                          Balasan Pokja: {item.jawaban_sanggah}
                        </div>
                      )}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'diterima' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                        item.status === 'sedang_ditinjau' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status === 'diterima' ? 'Diterima' : item.status === 'ditolak' ? 'Ditolak' : item.status === 'sedang_ditinjau' ? 'Ditinjau' : 'Baru'}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-center">
                      {isAdmin ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs px-2.5 py-1"
                          onClick={() => openReviewModal(item)}
                        >
                          <Lucide icon="CheckSquare" className="w-3.5 h-3.5 mr-1" />
                          Beri Balasan
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Tersedia untuk Pokja</span>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Modal Ajukan Sanggahan (Vendor) */}
      <Dialog open={showSubmitModal} onClose={() => setShowSubmitModal(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lucide icon="ShieldAlert" className="w-5 h-5 text-warning" />
              Pengajuan Surat Sanggahan
            </Dialog.Title>
            <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitSanggahan} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Nomor Surat Resmi Sanggahan *
              </label>
              <FormInput
                type="text"
                placeholder="Contoh: 012/SGH-VND/X/2026"
                value={formData.noSurat}
                onChange={(e) => setFormData({ ...formData, noSurat: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Tanggal Pengajuan *
              </label>
              <FormInput
                type="date"
                value={formData.tanggalSanggah}
                onChange={(e) => setFormData({ ...formData, tanggalSanggah: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Dokumen Bukti Sanggahan (PDF) *
              </label>
              <FormInput
                type="text"
                placeholder="Contoh: dokumen_bukti_sanggahan.pdf"
                value={formData.fileDokumentasi}
                onChange={(e) => setFormData({ ...formData, fileDokumentasi: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Substansi & Alasan Sanggahan *
              </label>
              <FormTextarea
                rows={4}
                placeholder="Jelaskan alasan sanggahan secara detail beserta pasal atau ketentuan KAK yang dilanggar..."
                value={formData.alasanSanggah}
                onChange={(e) => setFormData({ ...formData, alasanSanggah: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button type="button" variant="outline-secondary" onClick={() => setShowSubmitModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Mengirimkan..." : "Kirim Sanggahan"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Modal Review & Balasan (Pokja / Admin) */}
      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lucide icon="CheckSquare" className="w-5 h-5 text-primary" />
              Keputusan & Balasan Sanggahan Pokja
            </Dialog.Title>
            <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUpdateJawabanSanggahan} className="mt-5 space-y-4">
            <div>
              <div className="text-xs text-slate-500">Nomor Surat</div>
              <div className="font-semibold text-slate-800 dark:text-white">{selectedSanggahan?.no_surat}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Alasan Sanggahan Vendor</div>
              <div className="p-3 bg-slate-50 dark:bg-darkmode-700 rounded text-sm text-slate-700 dark:text-slate-200">
                {selectedSanggahan?.alasan_sanggah}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Status Keputusan Pokja *
              </label>
              <FormSelect
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="mt-1"
              >
                <option value="sedang_ditinjau">Sedang Ditinjau</option>
                <option value="diterima">Diterima (Sanggahan Terbukti Benar)</option>
                <option value="ditolak">Ditolak (Sanggahan Tidak Berdasar)</option>
              </FormSelect>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Balasan Resmi Pokja Pemilihan *
              </label>
              <FormTextarea
                rows={4}
                placeholder="Tuliskan penjelasan dan surat jawaban resmi Pokja kepada penyedia..."
                value={jawabanSanggah}
                onChange={(e) => setJawabanSanggah(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button type="button" variant="outline-secondary" onClick={() => setReviewModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan Keputusan"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default MasaSanggahAction;
