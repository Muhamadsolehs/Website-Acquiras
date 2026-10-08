import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { FormInput, FormTextarea } from "@/components/Base/Form";
import { Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

const ShowDetailVendor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pengumuman" | "peserta">("pengumuman");
  const [lelang, setLelang] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal Daftar/Ikuti Lelang
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [nilaiPenawaran, setNilaiPenawaran] = useState("");
  const [fileDokumen, setFileDokumen] = useState("dokumen_penawaran_lengkap.pdf");
  const [catatanPenawaran, setCatatanPenawaran] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/lelang/${id}`);
      setLelang(res.data);
    } catch (err: any) {
      toast.error("Gagal memuat detail lelang: " + (err.response?.data?.message || err.message));
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
      fetchDetail();
    }
  }, [id]);

  const handleSubmitPenawaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nilaiPenawaran) {
      toast.error("Mohon masukkan nilai penawaran harga");
      return;
    }

    const vendorId = currentUser?.vendor?.id || 1; // Fallback to current vendor

    try {
      setSubmitting(true);
      await api.post("/lelang-peserta", {
        lelang_id: id,
        vendor_id: vendorId,
        nilai_penawaran: Number(nilaiPenawaran),
        file_dokumen_penawaran: fileDokumen,
        status_peserta: "Memasukkan Penawaran",
      });

      toast.success("Berhasil mendaftar dan mengirimkan penawaran lelang!");
      setBidModalOpen(false);
      fetchDetail();
    } catch (err: any) {
      toast.error("Gagal mendaftar lelang: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Lucide icon="Loader2" className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
        Memuat rincian lelang...
      </div>
    );
  }

  if (!lelang) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Lucide icon="AlertCircle" className="w-12 h-12 mx-auto mb-3 text-danger" />
        Data lelang tidak ditemukan.
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/dashboard/lelang/daftar-lelang")}>
            Kembali ke Daftar Lelang
          </Button>
        </div>
      </div>
    );
  }

  const paket = lelang.paket || {};
  const satker = paket.satker || {};
  const pesertaList = lelang.peserta || [];
  const userVendorId = currentUser?.vendor?.id;
  const isAlreadyRegistered = pesertaList.some((p: any) => p.vendor_id === userVendorId);

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
                {lelang.judul_lelang || paket.nama_paket}
              </h1>
            </div>
            <p className="text-slate-300 mt-1">
              Nomor Lelang: <span className="font-semibold text-white">{lelang.no_lelang}</span> | Kode Paket: <span className="font-semibold text-white">{paket.kode_paket}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-300">Nilai Pagu Paket</div>
              <div className="text-2xl font-bold text-emerald-400">
                Rp {Number(paket.nilai_pagu_paket || 0).toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-slate-400">
                HPS: Rp {Number(paket.hps || 0).toLocaleString("id-ID")}
              </div>
            </div>

            <Button
              variant={isAlreadyRegistered ? "outline-secondary" : "primary"}
              className={isAlreadyRegistered ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40" : "bg-primary text-white"}
              onClick={() => {
                if (isAlreadyRegistered) {
                  toast.info("Anda sudah terdaftar sebagai peserta pada lelang ini.");
                } else {
                  setBidModalOpen(true);
                }
              }}
            >
              <Lucide icon={isAlreadyRegistered ? "CheckCircle" : "Send"} className="w-4 h-4 mr-2" />
              {isAlreadyRegistered ? "Sudah Terdaftar" : "Ikuti Lelang & Tawar"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Lucide icon="AlertCircle" className="w-3.5 h-3.5 mr-1" />
            Status: {lelang.status}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {paket.jenis_paket === "tender" ? "Tender Terbuka" : "Pengadaan Langsung (Non-Tender)"}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Metode: {paket.metode_pengadaan || "Pascakualifikasi Satu File"}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Satker: {satker.nama_satker || "Satuan Kerja"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("pengumuman")}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors flex items-center ${
              activeTab === "pengumuman"
                ? "border-primary text-primary"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Lucide icon="Megaphone" className="w-4 h-4 mr-2" />
            Pengumuman & Spesifikasi
          </button>
          <button
            onClick={() => setActiveTab("peserta")}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors flex items-center ${
              activeTab === "peserta"
                ? "border-primary text-primary"
                : "border-transparent text-slate-300 hover:text-white"
            }`}
          >
            <Lucide icon="Users" className="w-4 h-4 mr-2" />
            Daftar Peserta ({pesertaList.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="box box--stacked p-6">
        {activeTab === "pengumuman" ? (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b pb-2 border-slate-200/60 dark:border-darkmode-400">
                Informasi & Jadwal Lelang
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Tanggal & Waktu Mulai</div>
                  <div className="mt-1 font-medium text-slate-800 dark:text-white">
                    {lelang.tanggal_mulai} {lelang.jam_mulai}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Batas Akhir Penawaran</div>
                  <div className="mt-1 font-medium text-slate-800 dark:text-white">
                    {lelang.tanggal_selesai} {lelang.jam_selesai}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Tahun Anggaran</div>
                  <div className="mt-1 font-medium text-slate-800 dark:text-white">
                    {paket.tahun_anggaran || new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b pb-2 border-slate-200/60 dark:border-darkmode-400">
                Spesifikasi Paket Pengadaan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Nama Paket</div>
                  <div className="mt-1 font-semibold text-slate-800 dark:text-white">
                    {paket.nama_paket}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Lokasi Pekerjaan</div>
                  <div className="mt-1 text-slate-800 dark:text-white">
                    {paket.lokasi_pekerjaan || "Sesuai Kerangka Acuan Kerja (KAK)"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Jenis Kontrak</div>
                  <div className="mt-1 text-slate-800 dark:text-white capitalize">
                    {paket.jenis_kontrak || "Lumsum / Harga Satuan"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Kualifikasi Usaha</div>
                  <div className="mt-1">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {paket.kualifikasi_usaha || "Semua Kualifikasi"}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Syarat Kualifikasi & Dokumen</div>
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-darkmode-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
                    {paket.syarat_kualifikasi || "1. Memiliki NIB dan Izin Usaha yang masih berlaku.\n2. Memiliki NPWP dan telah melunasi kewajiban perpajakan tahun terakhir (SPT Tahunan).\n3. Memiliki pengalaman penyediaan barang/jasa sejenis dalam 3 tahun terakhir.\n4. Tidak masuk dalam Daftar Hitam (Blacklist)."}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b pb-2 border-slate-200/60 dark:border-darkmode-400">
                Deskripsi & Ketentuan Tambahan
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {lelang.deskripsi_lelang || "Penyedia yang berminat diwajibkan mengunggah seluruh dokumen penawaran teknis dan harga sebelum batas waktu yang telah ditentukan. Evaluasi penawaran dilakukan dengan sistem gugur untuk aspek administrasi dan teknis, dilanjutkan dengan pembobotan harga terbaik."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Daftar Peserta Lelang
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vendor terdaftar yang telah memasukkan kualifikasi dan penawaran
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      No
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Nama Vendor
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Kode Vendor
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Nilai Penawaran (Rp)
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Skor Total
                    </Table.Td>
                    <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                      Status Evaluasi
                    </Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {pesertaList.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={6} className="py-8 text-center text-slate-500">
                        Belum ada vendor yang mendaftar pada lelang ini.
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    pesertaList.map((p: any, idx: number) => (
                      <Table.Tr key={p.id || idx}>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          {idx + 1}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-semibold text-slate-800 dark:text-white">
                          {p.vendor?.nama_perusahaan || `Vendor #${p.vendor_id}`}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-xs text-primary font-mono">
                          {p.vendor?.id_vendor_code || "-"}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600">
                          {p.nilai_penawaran ? `Rp ${Number(p.nilai_penawaran).toLocaleString("id-ID")}` : "-"}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          {p.total_skor ? (
                            <span className="font-semibold text-primary">{p.total_skor}</span>
                          ) : (
                            <span className="text-xs text-slate-400">Tahap Evaluasi</span>
                          )}
                        </Table.Td>
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            p.status_peserta === 'Pemenang' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-bold' :
                            p.status_peserta === 'Gugur' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          }`}>
                            {p.status_peserta || "Terdaftar"}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Daftar & Kirim Penawaran */}
      <Dialog open={bidModalOpen} onClose={() => setBidModalOpen(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lucide icon="Send" className="w-5 h-5 text-primary" />
              Pendaftaran & Penawaran Lelang
            </Dialog.Title>
            <button onClick={() => setBidModalOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitPenawaran} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Nama Paket Lelang
              </label>
              <div className="mt-1 p-2.5 bg-slate-100 dark:bg-darkmode-700 rounded text-sm text-slate-800 dark:text-white font-medium">
                {lelang.judul_lelang || paket.nama_paket}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Nilai Penawaran Harga (Rp) *
              </label>
              <FormInput
                type="number"
                placeholder="Contoh: 450000000"
                value={nilaiPenawaran}
                onChange={(e) => setNilaiPenawaran(e.target.value)}
                required
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">
                Pagu: Rp {Number(paket.nilai_pagu_paket || 0).toLocaleString("id-ID")}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Nama File Dokumen Penawaran Teknis & Harga *
              </label>
              <FormInput
                type="text"
                placeholder="Contoh: dokumen_penawaran_pt_vendor.pdf"
                value={fileDokumen}
                onChange={(e) => setFileDokumen(e.target.value)}
                required
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">
                Dokumen terenkripsi hingga waktu pembukaan lelang.
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Catatan Penawaran (Opsional)
              </label>
              <FormTextarea
                rows={3}
                placeholder="Tambahkan catatan khusus atau penjelasan masa berlaku penawaran..."
                value={catatanPenawaran}
                onChange={(e) => setCatatanPenawaran(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button type="button" variant="outline-secondary" onClick={() => setBidModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Lucide icon="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Lucide icon="Check" className="w-4 h-4 mr-2" />
                    Kirim Penawaran
                  </>
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ShowDetailVendor;
