import React, { useState } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect } from "@/components/Base/Form";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl, computeSha256 } from "@/config/blockchain";
import { Web3Service } from "@/utils/web3Client";
import { toast } from "sonner";
import clsx from "clsx";

interface BlockchainVerifyDocModalProps {
  open: boolean;
  onClose: () => void;
  defaultRefId?: number;
  defaultDocType?: string;
  defaultSignerName?: string;
}

export const BlockchainVerifyDocModal: React.FC<BlockchainVerifyDocModalProps> = ({
  open,
  onClose,
  defaultRefId = 1,
  defaultDocType = "KONTRAK",
  defaultSignerName = "Pejabat Pembuat Komitmen (PPK)",
}) => {
  const [activeTab, setActiveTab] = useState<"verify" | "register">("verify");

  // State File & Hash
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [calculatingHash, setCalculatingHash] = useState(false);
  const [fileHash, setFileHash] = useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // State Verifikasi
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // State Pendaftaran Baru (TTE / Sign)
  const [refId, setRefId] = useState(defaultRefId);
  const [docType, setDocType] = useState(defaultDocType);
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [bsreCertId, setBsreCertId] = useState(`BSRE-TTE-${Date.now().toString().slice(-6)}`);
  const [submittingSign, setSubmittingSign] = useState(false);
  const [registeredTxHash, setRegisteredTxHash] = useState<string | null>(null);

  // Hitung SHA-256 dari File Binary Asli
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setVerificationResult(null);
    setRegisteredTxHash(null);
    setCalculatingHash(true);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setFileHash(hashHex);
      toast.success("Sidik jari digital SHA-256 berkas berhasil dihitung!");
    } catch (err: any) {
      console.error("Gagal menghitung hash:", err);
      toast.error("Gagal membaca berkas: " + err.message);
    } finally {
      setCalculatingHash(false);
    }
  };

  // Verifikasi ke Smart Contract Sepolia
  const handleVerifyOnChain = async () => {
    if (!fileHash) {
      toast.error("Mohon pilih berkas dokumen terlebih dahulu");
      return;
    }

    try {
      setVerifying(true);
      const isVerified = await Web3Service.verifyDocumentHashOnChain(fileHash);
      setVerificationResult(isVerified);

      if (isVerified) {
        toast.success("VALID! Dokumen ini 100% Asli dan Terdaftar di Smart Contract!");
      } else {
        toast.error("INVALID: Dokumen tidak terdaftar atau telah mengalami perubahan isi!");
      }
    } catch (err: any) {
      console.error("Error verifikasi dokumen:", err);
      toast.error("Gagal menghubungi smart contract: " + err.message);
    } finally {
      setVerifying(false);
    }
  };

  // Daftarkan TTE Dokumen ke Smart Contract via MetaMask
  const handleRegisterSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileHash) {
      toast.error("Mohon pilih berkas dokumen yang akan ditandatangani");
      return;
    }

    if (!Web3Service.isWalletAvailable()) {
      toast.error("MetaMask tidak terdeteksi. Silakan gunakan browser dengan ekstensi MetaMask.");
      return;
    }

    try {
      setSubmittingSign(true);
      toast.info("Membuka MetaMask untuk merekam tanda tangan digital (recordSignature)...");

      const result = await Web3Service.recordSignatureOnChain({
        refId: Number(refId),
        docType,
        documentHash: fileHash,
        signerName,
        bsreCertId,
      });

      setRegisteredTxHash(result.txHash);
      toast.success("Dokumen resmi ditandatangani & dicatat secara permanen di blockchain!");
      
      // Otomatis ubah hasil verifikasi jadi valid
      setVerificationResult(true);
    } catch (err: any) {
      console.error("Gagal rekam tanda tangan on-chain:", err);
      if (err.code === 4001 || err.action === "reject") {
        toast.warning("Transaksi dibatalkan di jendela MetaMask.");
      } else {
        toast.error("Gagal: " + (err.reason || err.message || "Gagal mencatat tanda tangan"));
      }
    } finally {
      setSubmittingSign(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-400 shadow-inner">
                <Lucide icon="FileCheck" className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Verifikasi Dokumen & TTE On-Chain
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    verifyDocumentHash()
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Uji Keaslian Berkas PDF (Kontrak / KAK / Penawaran) terhadap Hash Smart Contract Sepolia
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 mt-5 bg-black/40 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("verify")}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
                activeTab === "verify"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Lucide icon="Search" className="w-3.5 h-3.5" />
              1. Verifikasi Keaslian PDF (Anti-Tamper)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={clsx(
                "flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
                activeTab === "register"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Lucide icon="PenTool" className="w-3.5 h-3.5" />
              2. Daftarkan TTE Kontrak Baru (MetaMask)
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Upload Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Unggah Berkas PDF Dokumen:</span>
              <span className="text-[11px] font-normal text-slate-500">Format PDF (Maks. 25 MB)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelected}
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-5 text-center cursor-pointer transition-all bg-slate-800/40 hover:bg-slate-800/80 group"
              >
                <Lucide icon="UploadCloud" className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-slate-200">
                  Pilih Dokumen PDF untuk Diuji
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Klik untuk memilih file PDF dari laptop Anda
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Lucide icon="FileText" className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Siap Diuji
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileHash("");
                    setVerificationResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Lucide icon="Trash2" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Fingerprint SHA-256 */}
          {fileHash && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Fingerprint Kriptografis (SHA-256):</span>
                <span className="text-[10px] text-purple-400 font-mono">32-Byte Keccak/SHA256</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-700 font-mono text-[11px] text-purple-300 break-all select-all">
                {fileHash}
              </div>
            </div>
          )}

          {/* Tab 1: Verifikasi Dokumen */}
          {activeTab === "verify" ? (
            <div className="space-y-4 pt-2">
              <Button
                variant="primary"
                onClick={handleVerifyOnChain}
                disabled={!fileHash || verifying || calculatingHash}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 shadow-lg flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                    Menghubungi Smart Contract Sepolia...
                  </>
                ) : (
                  <>
                    <Lucide icon="Search" className="w-4 h-4" />
                    Verifikasi Dokumen ke Smart Contract Sepolia
                  </>
                )}
              </Button>

              {/* Hasil Verifikasi */}
              {verificationResult !== null && (
                <div
                  className={clsx(
                    "p-4 rounded-xl border space-y-2 transition-all",
                    verificationResult
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-rose-950/40 border-rose-500/50 text-rose-200"
                  )}
                >
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Lucide
                      icon={verificationResult ? "CheckCircle2" : "ShieldAlert"}
                      className={clsx("w-5 h-5", verificationResult ? "text-emerald-400" : "text-rose-400")}
                    />
                    <span>
                      {verificationResult
                        ? "DOKUMEN ASLI & TERVERIFIKASI ON-CHAIN!"
                        : "PERINGATAN: DOKUMEN TIDAK TERDAFTAR / TELAH DIMODIFIKASI!"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {verificationResult
                      ? "Sidik jari SHA-256 berkas ini COCOK 100% dengan data yang tersimpan di Smart Contract Sepolia. Dokumen ini sah secara digital dan tidak pernah diubah sejak ditandatangani."
                      : "Hash berkas ini TIDAK DITEMUKAN di catatan smart contract. Jika dokumen ini adalah kontrak resmi, berkas mungkin telah diedit atau belum didaftarkan."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Daftarkan TTE Kontrak Baru */
            <form onSubmit={handleRegisterSignature} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold uppercase">Ref ID (ID Kontrak):</label>
                  <FormInput
                    type="number"
                    value={refId}
                    onChange={(e) => setRefId(Number(e.target.value))}
                    required
                    className="mt-1 bg-slate-800/60 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold uppercase">Jenis Dokumen:</label>
                  <FormSelect
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="mt-1 bg-slate-800/60 border-slate-700 text-white"
                  >
                    <option value="KONTRAK">Surat Perjanjian Kontrak</option>
                    <option value="BAHP">Berita Acara Hasil Pemilihan (BAHP)</option>
                    <option value="SURAT_JALAN">Surat Jalan Pengiriman Fisik</option>
                    <option value="BAP">Berita Acara Pembayaran (BAP)</option>
                    <option value="SPB">Surat Perintah Bayar (SPB)</option>
                  </FormSelect>
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 font-semibold uppercase">Nama Penandatangan (TTE):</label>
                  <FormInput
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    required
                    className="mt-1 bg-slate-800/60 border-slate-700 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 font-semibold uppercase">Nomor Sertifikat TTE / BSrE:</label>
                  <FormInput
                    type="text"
                    value={bsreCertId}
                    onChange={(e) => setBsreCertId(e.target.value)}
                    required
                    className="mt-1 bg-slate-800/60 border-slate-700 text-white"
                  />
                </div>
              </div>

              {registeredTxHash && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <Lucide icon="CheckCircle" className="w-4 h-4 text-emerald-400" />
                    Tanda Tangan Berhasil Dicatat di Sepolia!
                  </div>
                  <a
                    href={getExplorerTxUrl(registeredTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline font-medium block truncate"
                  >
                    {registeredTxHash}
                  </a>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={!fileHash || submittingSign || calculatingHash}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 shadow-lg flex items-center justify-center gap-2 mt-3"
              >
                {submittingSign ? (
                  <>
                    <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                    Merekam TTE ke Sepolia via MetaMask...
                  </>
                ) : (
                  <>
                    <Lucide icon="ShieldCheck" className="w-4 h-4" />
                    Tandatangani & Kunci Hash ke Smart Contract Sepolia
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-t border-slate-800 text-xs">
          <a
            href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 underline"
          >
            <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
            Kontrak: {formatAddress(BLOCKCHAIN_CONFIG.contractAddress)}
          </a>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
