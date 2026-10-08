import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormTextarea } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";

const PenagihanAction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<any>(null);
  const [penagihanList, setPenagihanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // New Invoice Modal
  const [createInvoiceModal, setCreateInvoiceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    no_penagihan: "",
    termin_ke: 1,
    jumlah_tagihan: "",
    tanggal_penagihan: new Date().toISOString().split("T")[0],
    deadline_pembayaran: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    keterangan: "Pembayaran Prestasi Pekerjaan Fisik Tahap 1",
    file_dokumen_tagihan: "berita_acara_pembayaran.pdf",
    status: "dikirim",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, pRes] = await Promise.all([
        api.get(`/kontrak-pekerjaan/${id}`),
        api.get(`/penagihan?kontrak_id=${id}`),
      ]);
      setContract(cRes.data);
      setPenagihanList(pRes.data || []);
    } catch (err: any) {
      toast.error("Gagal memuat data penagihan: " + (err.response?.data?.message || err.message));
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

  const handleOpenCreateInvoice = () => {
    const terminNext = penagihanList.length + 1;
    setInvoiceForm({
      no_penagihan: `INV/${Date.now().toString().slice(-4)}/TERM-${terminNext}/2026`,
      termin_ke: terminNext,
      jumlah_tagihan: Math.round(Number(contract?.nilai_kontrak || 0) * 0.3).toString(),
      tanggal_penagihan: new Date().toISOString().split("T")[0],
      deadline_pembayaran: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      keterangan: `Pembayaran Prestasi Pekerjaan Fisik Termin Ke-${terminNext}`,
      file_dokumen_tagihan: `dokumen_tagihan_termin_${terminNext}.pdf`,
      status: "dikirim",
    });
    setCreateInvoiceModal(true);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const vendorId = contract?.vendor_id || currentUser?.vendor?.id || 1;

    try {
      setSubmitting(true);
      await api.post("/penagihan", {
        kontrak_id: id,
        vendor_id: vendorId,
        no_penagihan: invoiceForm.no_penagihan,
        termin_ke: Number(invoiceForm.termin_ke),
        jumlah_tagihan: Number(invoiceForm.jumlah_tagihan),
        tanggal_penagihan: invoiceForm.tanggal_penagihan,
        deadline_pembayaran: invoiceForm.deadline_pembayaran,
        keterangan: invoiceForm.keterangan,
        file_dokumen_tagihan: invoiceForm.file_dokumen_tagihan,
        status: invoiceForm.status,
      });

      toast.success("Surat tagihan / invoice berhasil dikirimkan ke purchasing!");
      setCreateInvoiceModal(false);
      fetchData();
    } catch (err: any) {
      toast.error("Gagal membuat tagihan: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovePayment = async (invoiceId: number) => {
    if (!window.confirm("Terbitkan Surat Perintah Bayar (SPM) dan tandai tagihan ini sebagai Dibayar?")) {
      return;
    }

    try {
      await api.put(`/penagihan/${invoiceId}`, {
        status: "dibayar",
      });

      toast.success("Surat Perintah Bayar berhasil diterbitkan! Status tagihan: DIBAYAR.");
      fetchData();
    } catch (err: any) {
      toast.error("Gagal memproses pembayaran: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Lucide icon="Loader2" className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
        Memuat rincian tagihan kontrak...
      </div>
    );
  }

  const nilaiKontrak = Number(contract?.nilai_kontrak || 0);
  const totalDibayar = penagihanList
    .filter((p) => p.status === "dibayar")
    .reduce((acc, p) => acc + Number(p.jumlah_tagihan || 0), 0);
  const totalDitagih = penagihanList.reduce((acc, p) => acc + Number(p.jumlah_tagihan || 0), 0);
  const sisaKontrak = Math.max(0, nilaiKontrak - totalDibayar);

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
                Penagihan & Pembayaran Kontrak
              </h1>
            </div>
            <p className="text-slate-300 mt-1">
              No Kontrak: <span className="font-semibold text-white font-mono">{contract?.no_kontrak}</span> | Vendor: <span className="font-semibold text-white">{contract?.vendor?.nama_perusahaan}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-primary text-white"
              onClick={handleOpenCreateInvoice}
            >
              <Lucide icon="FilePlus2" className="w-4 h-4 mr-2" />
              Buat Tagihan Baru
            </Button>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500 font-medium uppercase">Nilai Total Kontrak</div>
            <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
              Rp {nilaiKontrak.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500 font-medium uppercase">Total Diajukan</div>
            <div className="text-xl font-bold text-primary mt-1">
              Rp {totalDitagih.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500 font-medium uppercase">Total Terbayar (SPM)</div>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              Rp {totalDibayar.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="box box--stacked p-4">
            <div className="text-xs text-slate-500 font-medium uppercase">Sisa Pembayaran</div>
            <div className="text-xl font-bold text-amber-500 mt-1">
              Rp {sisaKontrak.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="box box--stacked p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Riwayat Penagihan & Pembayaran (Termin)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table className="border-b border-slate-200/60">
            <Table.Thead>
              <Table.Tr>
                <Table.Td className="w-12 py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Termin
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Nomor Tagihan
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Tanggal Pengajuan
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Jumlah Tagihan (Rp)
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Keterangan
                </Table.Td>
                <Table.Td className="py-3.5 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Status
                </Table.Td>
                <Table.Td className="w-48 py-3.5 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                  Aksi
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {penagihanList.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} className="py-8 text-center text-slate-500">
                    Belum ada penagihan yang diajukan untuk kontrak ini.
                  </Table.Td>
                </Table.Tr>
              ) : (
                penagihanList.map((item, idx) => (
                  <Table.Tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-bold text-center">
                      Ke-{item.termin_ke || idx + 1}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-mono text-xs font-semibold text-primary">
                      {item.no_penagihan}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-xs text-slate-500">
                      {item.tanggal_penagihan}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600">
                      Rp {Number(item.jumlah_tagihan || 0).toLocaleString("id-ID")}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-sm text-slate-700 dark:text-slate-300">
                      {item.keterangan || "-"}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'dibayar' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'dikirim' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {item.status === 'dibayar' ? 'Lunas (Dibayar)' : item.status === 'dikirim' ? 'Menunggu Approval' : item.status}
                      </span>
                      {item.tanggal_dibayar && (
                        <div className="text-[10px] text-slate-400 mt-1">Tgl bayar: {item.tanggal_dibayar}</div>
                      )}
                    </Table.Td>
                    <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600 text-center">
                      {isAdmin && item.status !== 'dibayar' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleApprovePayment(item.id)}
                        >
                          <Lucide icon="CheckCircle" className="w-3.5 h-3.5 mr-1" />
                          Terbitkan SP Bayar
                        </Button>
                      ) : item.status === 'dibayar' ? (
                        <span className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                          <Lucide icon="BadgeCheck" className="w-4 h-4" />
                          SPM Diterbitkan
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Menunggu Verifikasi</span>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Modal Buat Tagihan */}
      <Dialog open={createInvoiceModal} onClose={() => setCreateInvoiceModal(false)} className="relative z-50">
        <Dialog.Panel className="p-6 w-full max-w-lg mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Lucide icon="Receipt" className="w-5 h-5 text-primary" />
              Pengajuan Invoice / Penagihan
            </Dialog.Title>
            <button onClick={() => setCreateInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateInvoice} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Nomor Tagihan *
                </label>
                <FormInput
                  type="text"
                  value={invoiceForm.no_penagihan}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, no_penagihan: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Termin Ke- *
                </label>
                <FormInput
                  type="number"
                  min="1"
                  max="10"
                  value={invoiceForm.termin_ke}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, termin_ke: Number(e.target.value) })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Jumlah Tagihan (Rp) *
              </label>
              <FormInput
                type="number"
                value={invoiceForm.jumlah_tagihan}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, jumlah_tagihan: e.target.value })}
                required
                className="mt-1"
              />
              <div className="text-xs text-slate-500 mt-1">
                Sisa Kontrak: Rp {sisaKontrak.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Tanggal Tagihan *
                </label>
                <FormInput
                  type="date"
                  value={invoiceForm.tanggal_penagihan}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, tanggal_penagihan: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                  Batas Pembayaran *
                </label>
                <FormInput
                  type="date"
                  value={invoiceForm.deadline_pembayaran}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, deadline_pembayaran: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                Keterangan Prestasi Pekerjaan *
              </label>
              <FormTextarea
                rows={3}
                value={invoiceForm.keterangan}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, keterangan: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60">
              <Button type="button" variant="outline-secondary" onClick={() => setCreateInvoiceModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Mengirimkan..." : "Kirim Tagihan"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default PenagihanAction;
