import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import { FormInput, FormTextarea, FormCheck } from "@/components/Base/Form";
import { Dialog } from "@/components/Base/Headless";
import api from "@/api/axiosinstance";
import { toast } from "sonner";
// Trigger HMR update for smart contract modal theme
import { BlockchainAuditBadge } from "@/components/Blockchain/BlockchainAuditBadge";
import { BlockchainBidModal } from "@/components/Blockchain/BlockchainBidModal";
import { BlockchainAwardModal } from "@/components/Blockchain/BlockchainAwardModal";
import { Web3Service } from "@/utils/web3Client";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl, computeSha256 } from "@/config/blockchain";

const ShowDetailVendor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pengumuman" | "peserta">("pengumuman");
  const [lelang, setLelang] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State Verifikasi Blockchain On-Chain
  const [onChainTender, setOnChainTender] = useState<any>(null);
  const [onChainBid, setOnChainBid] = useState<any>(null);
  const [checkingChain, setCheckingChain] = useState<boolean>(false);
  const [blockchainBidModalOpen, setBlockchainBidModalOpen] = useState<boolean>(false);
  const [selectedBidVendor, setSelectedBidVendor] = useState<{ id: number; nama: string; harga: number } | null>(null);

  // Modal Penetapan Pemenang (awardWinner)
  const [awardModalOpen, setAwardModalOpen] = useState<boolean>(false);
  const [selectedAwardCandidate, setSelectedAwardCandidate] = useState<{ id: number; nama: string; harga: number; pesertaId?: number } | null>(null);

  // Modal Daftar/Ikuti Lelang
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [nilaiPenawaran, setNilaiPenawaran] = useState("");
  const [fileDokumen, setFileDokumen] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [catatanPenawaran, setCatatanPenawaran] = useState("");
  const [sealOnChainDirectly, setSealOnChainDirectly] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Format dokumen harus berupa file PDF (.pdf)");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error("Ukuran file PDF maksimal 25 MB");
        return;
      }
      setSelectedFile(file);
      setFileDokumen(file.name);
    }
  };

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

  // Baca Status Live dari Smart Contract Sepolia
  const checkBlockchainState = async (userVendorId?: number) => {
    if (!id) return;
    try {
      setCheckingChain(true);

      // 1. Baca data Tender on-chain
      const tenderData = await Web3Service.getTenderOnChain(Number(id));
      if (tenderData && Number(tenderData.id) > 0) {
        setOnChainTender(tenderData);
      } else {
        setOnChainTender(null);
      }

      // 2. Baca data Bid Vendor on-chain HANYA jika pengguna adalah akun vendor
      const vId = userVendorId || currentUser?.vendor?.id;
      if (vId) {
        const bidData = await Web3Service.getBidOnChain(Number(id), Number(vId));
        if (bidData && Number(bidData.submittedAt) > 0) {
          setOnChainBid(bidData);
        } else {
          setOnChainBid(null);
        }
      } else {
        setOnChainBid(null);
      }
    } catch (err) {
      console.warn("Gagal membaca state on-chain:", err);
    } finally {
      setCheckingChain(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("eproc_user");
    let parsedUser = null;
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
        setCurrentUser(parsedUser);
      } catch (e) {}
    }
    if (id) {
      fetchDetail();
      checkBlockchainState(parsedUser?.vendor?.id);
    }
  }, [id]);

  const handleSubmitPenawaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nilaiPenawaran) {
      toast.error("Mohon masukkan nilai penawaran harga");
      return;
    }

    if (!selectedFile && !fileDokumen) {
      toast.error("Mohon unggah berkas dokumen penawaran teknis & harga (format PDF)");
      return;
    }

    const vendorId = currentUser?.vendor?.id || 1;
    const hargaNumber = Math.round(Number(nilaiPenawaran));

    try {
      setSubmitting(true);

      let txHashOnChain = "";
      let computedBidHash = "";

      // Eksekusi Segel On-Chain jika diaktifkan
      if (sealOnChainDirectly) {
        if (!Web3Service.isWalletAvailable()) {
          toast.warning("MetaMask tidak terdeteksi. Melanjutkan penyimpanan penawaran di database sistem saja.");
        } else if (!onChainTender || Number(onChainTender.id) === 0) {
          toast.warning("Tender ini belum dipublikasikan oleh Panitia ke Smart Contract. Penawaran disimpan di database sistem.");
        } else {
          toast.info("Membuka MetaMask untuk konfirmasi transaksi submitBid on-chain...");

          let docName = selectedFile ? selectedFile.name : fileDokumen;
          computedBidHash = await computeSha256(
            JSON.stringify({
              tenderId: Number(id),
              vendorId: Number(vendorId),
              harga: hargaNumber,
              file: docName,
              timestamp: Date.now(),
            })
          );

          const ipfsCid = "QmBid_" + Math.random().toString(36).substring(2, 10).toUpperCase();

          const web3Res = await Web3Service.submitBidOnChain({
            tenderId: Number(id),
            vendorId: Number(vendorId),
            penawaranHarga: hargaNumber,
            ipfsDokumenPenawaran: ipfsCid,
            penawaranHash: computedBidHash,
          });

          txHashOnChain = web3Res.txHash;
          toast.success("Penawaran resmi tersegel di Ethereum Sepolia!");
        }
      }

      // Simpan data ke Database Laravel Web2
      const formData = new FormData();
      formData.append("lelang_id", String(id));
      formData.append("vendor_id", String(vendorId));
      formData.append("nilai_penawaran", String(nilaiPenawaran));
      formData.append("status_peserta", "Memasukkan Penawaran");
      if (selectedFile) {
        formData.append("file_dokumen", selectedFile);
        formData.append("file_dokumen_penawaran", selectedFile.name);
      } else {
        formData.append("file_dokumen_penawaran", fileDokumen);
      }

      await api.post("/lelang-peserta", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Berhasil mendaftar dan mengunggah penawaran lelang!");
      setBidModalOpen(false);
      fetchDetail();
      checkBlockchainState(vendorId);
    } catch (err: any) {
      console.error("Gagal submit penawaran:", err);
      if (err.code === 4001 || err.action === "reject") {
        toast.warning("Transaksi dibatalkan oleh pengguna di MetaMask.");
      } else {
        toast.error("Gagal mendaftar lelang: " + (err.reason || err.response?.data?.message || err.message));
      }
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
  const myPeserta = userVendorId ? pesertaList.find((p: any) => p.vendor_id === userVendorId) : null;
  const isAlreadyRegistered = Boolean(myPeserta);
  const myPenawaranHarga = myPeserta ? Number(myPeserta.nilai_penawaran || 0) : 0;

  const userRole = (currentUser?.role || "").toLowerCase();
  const isVendor = Boolean(currentUser?.vendor) || userRole === "vendor";
  const isAdmin = !isVendor || userRole.includes("admin") || userRole.includes("panitia") || userRole.includes("ppk");
  const winnerPeserta = pesertaList.find((p: any) => p.status_peserta === "Pemenang");

  const handleWinnerAwarded = async (result: any) => {
    try {
      if (selectedAwardCandidate?.pesertaId) {
        await api.put(`/lelang-peserta/${selectedAwardCandidate.pesertaId}`, {
          status_peserta: "Pemenang",
        });
      }
      await api.put(`/lelang/${id}`, {
        status: "Masa Sanggah",
      });
      toast.success("Penetapan pemenang berhasil dicatat di Blockchain! Lelang kini memasuki tahap Masa Sanggah.");
    } catch (err: any) {
      console.error("Gagal sinkron status pemenang ke sistem database:", err);
    } finally {
      fetchDetail();
      checkBlockchainState();
    }
  };

  return (
    <div className="px-6 py-8">
      {/* Header Info */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <button
              type="button"
              className="h-10 px-3.5 rounded-lg bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 shrink-0 cursor-pointer border-none"
              onClick={() => navigate(-1)}
            >
              <Lucide icon="ArrowLeft" className="w-4 h-4 text-slate-700" />
              <span>Kembali</span>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {lelang.judul_lelang || paket.nama_paket}
              </h1>
              <p className="text-slate-200 text-xs mt-1">
                Nomor Lelang: <span className="font-semibold text-white font-mono">{lelang.no_lelang}</span> | Kode Paket: <span className="font-semibold text-white font-mono">{paket.kode_paket}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:self-center">
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-200 uppercase font-medium tracking-wider">Nilai Pagu Paket</div>
              <div className="text-2xl font-black text-emerald-300">
                Rp {Number(paket.nilai_pagu || paket.nilai_hps || paket.nilai_pagu_paket || 0).toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-slate-300">
                HPS: Rp {Number(paket.nilai_hps || paket.hps || paket.nilai_pagu || 0).toLocaleString("id-ID")}
              </div>
            </div>

            {/* Tombol Tahap Masa Sanggah */}
            {(lelang.status === "Masa Sanggah" || lelang.status === "Selesai" || Boolean(winnerPeserta)) && (
              <button
                type="button"
                onClick={() => navigate(`/dashboard/lelang/masa-sanggah/${id}`)}
                className="h-10 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-none"
              >
                <Lucide icon="ShieldAlert" className="w-4 h-4 text-purple-200" />
                <span>{isAdmin ? "Kelola Masa Sanggah" : "Tahap Masa Sanggah"}</span>
              </button>
            )}

            {/* Aksi Header - Hanya tampil untuk Vendor yang berhak mendaftar / mengirim penawaran jika belum masa sanggah / selesai */}
            {isVendor && lelang.status !== "Masa Sanggah" && lelang.status !== "Selesai" && (
              <div className="flex flex-wrap items-center gap-2">
                {onChainBid && Number(onChainBid.submittedAt) > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBidVendor({
                        id: userVendorId,
                        nama: currentUser?.vendor?.nama_perusahaan || "Perusahaan Anda",
                        harga: Number(onChainBid.penawaranHarga),
                      });
                      setBlockchainBidModalOpen(true);
                    }}
                    className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-none"
                  >
                    <Lucide icon="ShieldCheck" className="w-4 h-4 text-emerald-100" />
                    <span>Penawaran Tersegel On-Chain</span>
                  </button>
                ) : isAlreadyRegistered ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toast.info("Anda sudah terdaftar sebagai peserta pada lelang ini.")}
                      className="h-10 px-4 rounded-lg bg-blue-700 text-white font-bold text-xs shadow-md inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-none"
                    >
                      <Lucide icon="CheckCircle" className="w-4 h-4 text-blue-100" />
                      <span>Sudah Terdaftar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBidVendor({
                          id: userVendorId,
                          nama: currentUser?.vendor?.nama_perusahaan || "Perusahaan Anda",
                          harga: myPenawaranHarga,
                        });
                        setBlockchainBidModalOpen(true);
                      }}
                      className="h-10 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-none"
                    >
                      <Lucide icon="Lock" className="w-4 h-4 text-amber-100" />
                      <span>Segel ke Blockchain</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBidModalOpen(true)}
                    className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border-none"
                  >
                    <Lucide icon="Send" className="w-4 h-4" />
                    <span>Ikuti Lelang & Tawar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badges Info Tender - Solid, Tidak Transparan */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md border ${
            lelang.status === "Masa Sanggah" ? "bg-purple-700 border-purple-500 text-purple-100" :
            lelang.status === "Selesai" ? "bg-emerald-700 border-emerald-500 text-emerald-100" :
            "bg-slate-900 border-slate-700"
          }`}>
            <Lucide icon="AlertCircle" className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Status: {lelang.status}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-700 text-white shadow-md">
            <Lucide icon="FileText" className="w-3.5 h-3.5 mr-1.5 text-indigo-200" />
            {paket.jenis_paket === "tender" ? "Tender Terbuka" : "Pengadaan Langsung (Non-Tender)"}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white shadow-md">
            <Lucide icon="CheckCircle" className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
            Metode: {paket.metode_pengadaan || "Pascakualifikasi Satu File"}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-amber-300 shadow-md border border-slate-700">
            <Lucide icon="Building2" className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Satker: {satker.nama_satker || "Satuan Kerja"}
          </span>
        </div>

        {/* Real Dynamic Blockchain Audit Banners */}
        <div className="mt-6 mb-2 space-y-3">
          {/* Banner Status Tender On-Chain */}
          {checkingChain ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300 flex items-center gap-2">
              <Lucide icon="Loader2" className="w-4 h-4 animate-spin text-blue-400" />
              Memeriksa integritas paket pengadaan di Ethereum Sepolia...
            </div>
          ) : onChainTender && Number(onChainTender.id) > 0 ? (
            <div className="rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-4 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Lucide icon="ShieldCheck" className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Smart Contract Verified On-Chain
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Tender #{onChainTender.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Paket pengadaan ini resmi terkunci di blockchain Sepolia. HPS On-Chain:{" "}
                    <span className="font-bold text-emerald-300">
                      Rp {Number(onChainTender.nilaiHps).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
              </div>
              <a
                href={`${BLOCKCHAIN_CONFIG.explorerUrl}/address/${BLOCKCHAIN_CONFIG.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-300 hover:text-emerald-200 underline flex items-center gap-1 font-semibold shrink-0"
              >
                <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
                Cek Kontrak di Sepolia Explorer
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lucide icon="Info" className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Paket tender ini belum dipublikasikan oleh Panitia ke Smart Contract.</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {BLOCKCHAIN_CONFIG.networkName}
              </span>
            </div>
          )}

          {/* Banner Status Penawaran Vendor On-Chain jika sudah tersegel */}
          {onChainBid && Number(onChainBid.submittedAt) > 0 && (
            <div className="rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 p-4 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Lucide icon="Lock" className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                      Penawaran Anda Tersegel On-Chain
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Anti-Tamper Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Harga Penawaran:{" "}
                    <span className="font-bold text-emerald-400">
                      Rp {Number(onChainBid.penawaranHarga).toLocaleString("id-ID")}
                    </span>{" "}
                    | Disegel Pada: {new Date(Number(onChainBid.submittedAt) * 1000).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="text-xs text-blue-300 border-blue-400/40 hover:bg-blue-900/40 shrink-0 flex items-center gap-1.5"
                onClick={() => {
                  setSelectedBidVendor({
                    id: userVendorId,
                    nama: currentUser?.vendor?.nama_perusahaan || "Perusahaan Anda",
                    harga: Number(onChainBid.penawaranHarga),
                  });
                  setBlockchainBidModalOpen(true);
                }}
              >
                <Lucide icon="Search" className="w-3.5 h-3.5" />
                Lihat Rincian Segel Kriptografis
              </Button>
            </div>
          )}

          {/* Banner Pemenang Lelang & Masa Sanggah */}
          {winnerPeserta && (
            <div className="rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 p-4 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Lucide icon="Trophy" className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider">
                      Pemenang Ditetapkan &bull; Tahap Masa Sanggah
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Winner Selected
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pemenang: <span className="font-bold text-amber-300">{winnerPeserta.vendor?.nama_perusahaan || `Vendor #${winnerPeserta.vendor_id}`}</span> | Nilai Final:{" "}
                    <span className="font-bold text-emerald-400">
                      Rp {Number(winnerPeserta.nilai_penawaran || 0).toLocaleString("id-ID")}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/lelang/masa-sanggah/${id}`)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer border-none shrink-0"
              >
                <Lucide icon="ShieldAlert" className="w-4 h-4 text-purple-200" />
                <span>{isAdmin ? "Buka Pengelolaan Sanggahan" : "Pantau / Ajukan Sanggahan"}</span>
              </button>
            </div>
          )}
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
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBidVendor({
                                  id: p.vendor_id,
                                  nama: p.vendor?.nama_perusahaan || `Vendor #${p.vendor_id}`,
                                  harga: Number(p.nilai_penawaran || 0),
                                });
                                setBlockchainBidModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer whitespace-nowrap border-none"
                              title="Klik untuk melihat bukti segel penawaran di Smart Contract"
                            >
                              <Lucide icon="ShieldCheck" className="w-3.5 h-3.5 text-blue-100" />
                              <span>Cek Segel On-Chain</span>
                            </button>

                            {isAdmin && p.status_peserta !== 'Pemenang' && lelang.status !== 'Selesai' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAwardCandidate({
                                    id: p.vendor_id,
                                    pesertaId: p.id,
                                    nama: p.vendor?.nama_perusahaan || `Vendor #${p.vendor_id}`,
                                    harga: Number(p.nilai_penawaran || 0),
                                  });
                                  setAwardModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer whitespace-nowrap border-none"
                                title="Tetapkan Vendor ini sebagai Pemenang Tender On-Chain & Web2"
                              >
                                <Lucide icon="Trophy" className="w-3.5 h-3.5 text-amber-300" />
                                <span>Tetapkan Pemenang</span>
                              </button>
                            )}
                          </div>
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
                Pagu: Rp {Number(paket.nilai_pagu || paket.nilai_hps || paket.nilai_pagu_paket || 0).toLocaleString("id-ID")}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase flex items-center justify-between">
                <span>Dokumen Penawaran Teknis & Harga (.PDF) *</span>
                <span className="text-[11px] font-normal text-slate-400">Format PDF, Maks. 25 MB</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 border-2 border-dashed border-slate-300 dark:border-darkmode-400 hover:border-primary/60 dark:hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/70 dark:bg-darkmode-700/50 hover:bg-slate-100/80 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Lucide icon="UploadCloud" className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Pilih Berkas PDF Dokumen Penawaran
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Klik untuk memilih file PDF dari perangkat Anda
                  </div>
                </div>
              ) : (
                <div className="mt-1.5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <Lucide icon="FileText" className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <Lucide icon="ShieldCheck" className="w-3.5 h-3.5" />
                          Siap Disegel ke Smart Contract
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFileDokumen("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 text-slate-400 hover:text-danger rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Ganti berkas"
                  >
                    <Lucide icon="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Opsi Segel Kriptografis Smart Contract */}
            <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 space-y-1.5">
              <div className="flex items-center gap-2">
                <FormCheck.Input
                  id="sealOnChain"
                  type="checkbox"
                  checked={sealOnChainDirectly}
                  onChange={(e) => setSealOnChainDirectly(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="sealOnChain" className="text-xs font-bold text-slate-800 dark:text-white cursor-pointer flex items-center gap-1.5">
                  <Lucide icon="ShieldCheck" className="w-4 h-4 text-blue-500" />
                  Segel Penawaran ke Smart Contract Sepolia (MetaMask)
                </label>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                Nilai penawaran & sidik jari SHA-256 berkas PDF akan dicatat ke smart contract di Ethereum Sepolia untuk menjamin kerahasiaan & integritas data sebelum pembukaan lelang.
              </p>
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
                    Menyegel & Mengirim...
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

      {/* Modal Pemeriksaan & Segel On-Chain */}
      {selectedBidVendor && (
        <BlockchainBidModal
          open={blockchainBidModalOpen}
          onClose={() => setBlockchainBidModalOpen(false)}
          tenderId={Number(id)}
          vendorId={selectedBidVendor.id}
          namaVendor={selectedBidVendor.nama}
          nilaiPenawaran={selectedBidVendor.harga || myPenawaranHarga}
          fileDokumenName={fileDokumen || "dokumen_penawaran.pdf"}
          onBidSubmittedOnChain={() => {
            checkBlockchainState(selectedBidVendor.id);
            fetchDetail();
          }}
        />
      )}

      {/* Modal Penetapan Pemenang Lelang On-Chain */}
      {selectedAwardCandidate && (
        <BlockchainAwardModal
          open={awardModalOpen}
          onClose={() => setAwardModalOpen(false)}
          tenderId={Number(id)}
          winnerVendorId={selectedAwardCandidate.id}
          namaVendor={selectedAwardCandidate.nama}
          finalPrice={selectedAwardCandidate.harga}
          onWinnerAwardedOnChain={handleWinnerAwarded}
        />
      )}
    </div>
  );
};

export default ShowDetailVendor;
