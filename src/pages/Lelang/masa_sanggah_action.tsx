import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

  // Form states (Vendor)
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

  // Admin Terbitkan Kontrak Modal
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
    nomorKontrak: "",
    tanggalKontrak: new Date().toISOString().split("T")[0],
    tanggalMulai: new Date().toISOString().split("T")[0],
    tanggalSelesai: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    nilaiKontrak: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lelangRes, sanggahanRes] = await Promise.all([
        api.get(`/lelang/${id}`),
        api.get(`/sanggahan?lelang_id=${id}`),
      ]);
      const lelangData = lelangRes.data;
      setLelang(lelangData);
      setSanggahanList(sanggahanRes.data || []);

      // Auto-prefill contract form based on winner
      const winner = (lelangData.peserta || []).find((p: any) => p.status_peserta === "Pemenang" || p.status === "Pemenang");
      const winnerPrice = winner ? Number(winner.nilai_penawaran || 0) : Number(lelangData.paket?.nilai_hps || 0);

      setContractForm((prev) => ({
        ...prev,
        nomorKontrak: prev.nomorKontrak || `KNT-${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${lelangData.no_lelang || id}`,
        nilaiKontrak: winnerPrice,
      }));
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

  const userRole = (currentUser?.role || "").toLowerCase();
  const isAdmin = currentUser?.role_id === 1 || currentUser?.role?.id === 1 || userRole.includes("admin") || userRole.includes("panitia") || userRole.includes("ppk");
  const isVendor = !isAdmin;
  const currentVendorId = currentUser?.vendor?.id || currentUser?.vendor_id || (isVendor ? currentUser?.id : null);

  const pesertaList = lelang?.peserta || [];
  const winnerPeserta = pesertaList.find((p: any) => p.status_peserta === "Pemenang" || p.status === "Pemenang");
  const myPeserta = currentVendorId ? pesertaList.find((p: any) => p.vendor_id === currentVendorId) : null;
  const isCurrentUserWinner = Boolean(winnerPeserta && currentVendorId && (winnerPeserta.vendor_id === currentVendorId));
  const hasSubmittedSanggahan = sanggahanList.some((s: any) => s.vendor_id === currentVendorId);

  const handleSubmitSanggahan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVendorId) {
      toast.error("Identitas vendor tidak ditemukan.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/sanggahan", {
        lelang_id: id,
        vendor_id: currentVendorId,
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

  const handleTerbitkanKontrak = async (e: React.FormEvent) => {
    e.preventDefault();
    const winVendorId = winnerPeserta?.vendor_id || lelang?.winner_vendor_id;
    if (!winVendorId) {
      toast.error("Pemenang lelang belum ditetapkan!");
      return;
    }

    try {
      setSubmitting(true);
      // Simpan ke database tabel kontrak_pekerjaan
      await api.post("/kontrak-pekerjaan", {
        paket_id: lelang.paket_id,
        vendor_id: winVendorId,
        nomor_kontrak: contractForm.nomorKontrak,
        tanggal_kontrak: contractForm.tanggalKontrak,
        tanggal_mulai: contractForm.tanggalMulai,
        tanggal_selesai: contractForm.tanggalSelesai,
        nilai_kontrak: contractForm.nilaiKontrak || Number(winnerPeserta?.nilai_penawaran || lelang?.paket?.nilai_hps || 0),
        status_pekerjaan: "progress",
        progres_persen: 0,
      });

      // Update status lelang menjadi Selesai
      await api.put(`/lelang/${id}`, {
        status: "Selesai",
      });

      toast.success("Masa Sanggah diselesaikan & Kontrak Pekerjaan resmi diterbitkan!");
      setContractModalOpen(false);
      navigate("/dashboard/monitoring-progress-pekerjaan");
    } catch (err: any) {
      toast.error("Gagal menerbitkan kontrak: " + (err.response?.data?.message || err.message));
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
                onClick={() => navigate(`/dashboard/master-lelang/${id}`)}
              >
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-1" />
                Kembali ke Detail Lelang
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
            {/* Action buttons based on Role */}
            {isAdmin ? (
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 shadow-md inline-flex items-center gap-2"
                onClick={() => setContractModalOpen(true)}
              >
                <Lucide icon="Briefcase" className="w-4 h-4 text-emerald-100" />
                <span>Selesaikan Masa Sanggah & Terbitkan Kontrak</span>
              </Button>
            ) : isCurrentUserWinner ? (
              <span className="px-3.5 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold inline-flex items-center gap-1.5 shadow-md">
                <Lucide icon="Trophy" className="w-4 h-4 text-amber-300" />
                <span>Pemenang Lelang Terpilih</span>
              </span>
            ) : hasSubmittedSanggahan ? (
              <span className="px-3.5 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold inline-flex items-center gap-1.5 shadow-md">
                <Lucide icon="CheckCircle2" className="w-4 h-4 text-blue-300" />
                <span>Sanggahan Anda Telah Diajukan</span>
              </span>
            ) : myPeserta ? (
              <Button
                variant="primary"
                className="bg-primary text-white font-bold text-xs h-10 px-4 shadow-md inline-flex items-center gap-2"
                onClick={() => setShowSubmitModal(true)}
              >
                <Lucide icon="ShieldAlert" className="w-4 h-4 text-amber-300" />
                <span>Ajukan Sanggahan</span>
              </Button>
            ) : (
              <span className="text-xs text-slate-300 italic bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                Hanya peserta lelang yang berhak mengajukan sanggahan
              </span>
            )}
          </div>
        </div>

        {/* Banner Pemenang Lelang */}
        {winnerPeserta && (
          <div className="mt-4 p-4 rounded-xl border border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Lucide icon="Trophy" className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-purple-300 font-bold flex items-center gap-2">
                  <span>Pemenang Hasil Evaluasi Lelang</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30">
                    Status: {lelang.status}
                  </span>
                </div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  {winnerPeserta.vendor?.nama_perusahaan || `Vendor #${winnerPeserta.vendor_id}`} &bull;{" "}
                  <span className="text-emerald-400">
                    Rp {Number(winnerPeserta.nilai_penawaran || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Masa sanggah memberikan waktu bagi penyedia lain untuk mengajukan sanggahan resmi sebelum penerbitan Kontrak Kerja.
                </p>
              </div>
            </div>

            {isAdmin && (
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold text-xs shrink-0 py-2.5 px-4"
                onClick={() => setContractModalOpen(true)}
              >
                <Lucide icon="FileText" className="w-4 h-4 mr-2 text-emerald-100" />
                Terbitkan Kontrak Kerja
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500">Nilai Pagu Paket</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              Rp {Number(paket.nilai_pagu_paket || paket.nilai_pagu || 0).toLocaleString("id-ID")}
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
            Daftar Berkas Sanggahan Masuk
          </h3>
          <span className="text-xs text-slate-500">
            Ditampilkan secara transparan sesuai kepatuhan regulasi pengadaan barang/jasa
          </span>
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
                    Belum ada sanggahan yang diajukan untuk paket pengadaan ini.
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
                        <span className="text-xs text-slate-400">
                          {item.jawaban_sanggah ? "Telah Dibalas" : "Menunggu Tanggapan"}
                        </span>
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
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Dialog.Title className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Lucide icon="ShieldAlert" className="w-5 h-5 text-amber-500" />
              Pengajuan Surat Sanggahan
            </Dialog.Title>
            <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitSanggahan} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">
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
              <label className="text-xs font-semibold text-slate-600 uppercase">
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
              <label className="text-xs font-semibold text-slate-600 uppercase">
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
              <label className="text-xs font-semibold text-slate-600 uppercase">
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

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Dialog.Title className="text-lg font-bold text-slate-800 flex items-center gap-2">
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
              <div className="font-semibold text-slate-800">{selectedSanggahan?.no_surat}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Alasan Sanggahan Vendor</div>
              <div className="p-3 bg-slate-50 rounded text-sm text-slate-700">
                {selectedSanggahan?.alasan_sanggah}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">
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
              <label className="text-xs font-semibold text-slate-600 uppercase">
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

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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

      {/* Modal Terbitkan Kontrak (Admin / PPK) */}
      <Dialog open={contractModalOpen} onClose={() => setContractModalOpen(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Dialog.Title className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Lucide icon="Briefcase" className="w-5 h-5 text-emerald-600" />
              Penerbitan Kontrak Kerja Sama
            </Dialog.Title>
            <button onClick={() => setContractModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleTerbitkanKontrak} className="mt-5 space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div>
                <span className="text-slate-500">Paket Pengadaan:</span>{" "}
                <span className="font-semibold text-slate-800">
                  {lelang?.judul_lelang || paket.nama_paket}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Penyedia Pemenang:</span>{" "}
                <span className="font-semibold text-emerald-600">
                  {winnerPeserta?.vendor?.nama_perusahaan || `Vendor #${winnerPeserta?.vendor_id}`}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Nilai Kontrak:</span>{" "}
                <span className="font-bold text-emerald-600 font-mono">
                  Rp {Number(contractForm.nilaiKontrak || winnerPeserta?.nilai_penawaran || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">
                Nomor Kontrak Resmi (SPPBJ / SPK) *
              </label>
              <FormInput
                type="text"
                placeholder="Contoh: KNT/2026/X/001"
                value={contractForm.nomorKontrak}
                onChange={(e) => setContractForm({ ...contractForm, nomorKontrak: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">
                  Tanggal Kontrak *
                </label>
                <FormInput
                  type="date"
                  value={contractForm.tanggalKontrak}
                  onChange={(e) => setContractForm({ ...contractForm, tanggalKontrak: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">
                  Tanggal Mulai *
                </label>
                <FormInput
                  type="date"
                  value={contractForm.tanggalMulai}
                  onChange={(e) => setContractForm({ ...contractForm, tanggalMulai: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase">
                Tanggal Selesai Pekerjaan *
              </label>
              <FormInput
                type="date"
                value={contractForm.tanggalSelesai}
                onChange={(e) => setContractForm({ ...contractForm, tanggalSelesai: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <Lucide icon="Info" className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Menerbitkan kontrak akan menyelesaikan tahap Masa Sanggah dan mendaftarkan paket ini ke modul <strong>Monitoring Progress Pekerjaan & Surat Jalan</strong>.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline-secondary" onClick={() => setContractModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {submitting ? "Menerbitkan Kontrak..." : "Terbitkan & Buka Monitoring"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default MasaSanggahAction;
