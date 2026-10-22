import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl } from "@/config/blockchain";
import { Web3Service } from "@/utils/web3Client";
import { toast } from "sonner";
import clsx from "clsx";

interface BlockchainAwardModalProps {
  open: boolean;
  onClose: () => void;
  tenderId: number;
  winnerVendorId: number;
  namaVendor: string;
  finalPrice: number;
  onWinnerAwardedOnChain?: (result: any) => void;
}

export const BlockchainAwardModal: React.FC<BlockchainAwardModalProps> = ({
  open,
  onClose,
  tenderId,
  winnerVendorId,
  namaVendor,
  finalPrice,
  onWinnerAwardedOnChain,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [onChainTender, setOnChainTender] = useState<any>(null);
  const [realTxHash, setRealTxHash] = useState<string | null>(null);
  const [copiedRemix, setCopiedRemix] = useState(false);

  const checkTenderState = async () => {
    try {
      setVerifying(true);
      const data = await Web3Service.getTenderOnChain(tenderId);
      if (data && Number(data.id) > 0) {
        setOnChainTender(data);
      } else {
        setOnChainTender(null);
      }
    } catch (err) {
      console.warn("Gagal membaca tender on-chain:", err);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (open) {
      checkTenderState();
      setRealTxHash(null);
    }
  }, [open, tenderId]);

  const handleExecuteAwardWinner = async () => {
    if (!Web3Service.isWalletAvailable()) {
      toast.error("MetaMask tidak terdeteksi. Silakan gunakan browser dengan ekstensi MetaMask.");
      return;
    }

    if (!onChainTender || Number(onChainTender.id) === 0) {
      toast.error(`Tender #${tenderId} belum tercatat di smart contract. Admin harus melakukan publishTender terlebih dahulu.`);
      return;
    }

    try {
      setSubmitting(true);
      toast.info("Membuka MetaMask untuk menandatangani penetapan pemenang lelang (awardWinner)...");

      const ipfsBeritaAcara = "QmBAHP_" + Math.random().toString(36).substring(2, 10).toUpperCase();

      const result = await Web3Service.awardWinnerOnChain({
        tenderId: Number(tenderId),
        winnerVendorId: Number(winnerVendorId),
        finalPrice: Math.round(Number(finalPrice)),
        ipfsBeritaAcara,
      });

      setRealTxHash(result.txHash);
      toast.success("Penetapan pemenang lelang resmi terkunci secara permanen di Ethereum Sepolia!");

      if (onWinnerAwardedOnChain) {
        onWinnerAwardedOnChain(result);
      }

      await checkTenderState();
    } catch (err: any) {
      console.error("Gagal award winner on-chain:", err);
      let errorMsg = err.reason || err.shortMessage || err.message || "Gagal mengeksekusi transaksi.";
      if (err.code === 4001 || errorMsg.includes("rejected")) {
        toast.warning("Transaksi dibatalkan oleh pengguna di MetaMask.");
      } else if (errorMsg.includes("Not authorized as admin") || errorMsg.includes("require(false)")) {
        toast.error("Akses Ditolak: Fungsi awardWinner hanya dapat dipanggil oleh wallet Admin/Deployer kontrak (0x28523...).");
      } else {
        toast.error("Gagal: " + errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const remixFormattedInput = `${tenderId}, ${winnerVendorId}, ${Math.round(Number(finalPrice))}, "QmBeritaAcaraPemenangLelang2026"`;

  const copyRemixInput = () => {
    navigator.clipboard.writeText(remixFormattedInput);
    setCopiedRemix(true);
    setTimeout(() => setCopiedRemix(false), 2000);
    toast.success("Parameter Remix IDE disalin!");
  };

  const isAlreadyAwarded = onChainTender && Number(onChainTender.winnerVendorId) > 0;
  const isCurrentWinner = onChainTender && Number(onChainTender.winnerVendorId) === Number(winnerVendorId);

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-inner">
                <Lucide icon="Trophy" className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    Penetapan Pemenang Lelang
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    awardWinner()
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Penguncian Pemenang & Berita Acara Hasil Pemilihan (BAHP) ke Blockchain
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
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status On-Chain Live */}
          <div className="rounded-xl border p-4 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Lucide icon="Activity" className="w-4 h-4 text-emerald-400" />
                Status Smart Contract Sepolia
              </div>
              <button
                onClick={checkTenderState}
                disabled={verifying}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <Lucide icon="RefreshCw" className={clsx("w-3.5 h-3.5", verifying && "animate-spin")} />
                {verifying ? "Mengecek..." : "Perbarui"}
              </button>
            </div>

            {verifying ? (
              <div className="flex items-center gap-2 text-xs text-slate-300 py-1">
                <Lucide icon="Loader2" className="w-4 h-4 animate-spin text-emerald-400" />
                Membaca status terkini dari blockchain Sepolia...
              </div>
            ) : isAlreadyAwarded ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Lucide icon="CheckCircle2" className="w-4 h-4 text-emerald-400" />
                  Pemenang Telah Terkunci di Blockchain!
                </div>
                <div>
                  Pemenang Sah On-Chain:{" "}
                  <span className="font-bold text-white">Vendor ID #{Number(onChainTender.winnerVendorId)}</span>
                </div>
                {isCurrentWinner ? (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700">
                    ✓ Vendor Ini Terkonfirmasi Sebagai Pemenang Resmi
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                    ⚠ Pemenang yang terkunci adalah Vendor #{Number(onChainTender.winnerVendorId)}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-200 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                  <Lucide icon="Info" className="w-4 h-4 text-blue-400 shrink-0" />
                  Belum Ada Pemenang yang Dikunci On-Chain
                </div>
                <p className="mt-1 text-slate-300">
                  Tender #{tenderId} berada pada status Published. Siap untuk dikunci dengan penetapan pemenang lelang.
                </p>
              </div>
            )}
          </div>

          {/* Rincian Pemenang */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Rincian Calon Pemenang
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-slate-400">Tender ID:</span>
                <div className="font-bold text-white text-sm">#{tenderId}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-slate-400">Vendor Pemenang:</span>
                <div className="font-bold text-emerald-400 text-sm truncate">
                  #{winnerVendorId} - {namaVendor}
                </div>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                <span className="text-slate-400">Harga Kontrak / Penawaran Final:</span>
                <div className="font-bold text-emerald-400 text-base">
                  Rp {Number(finalPrice).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          {/* Transaksi Sukses */}
          {realTxHash && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <Lucide icon="CheckCircle" className="w-4 h-4 text-emerald-400" />
                Transaksi Sukses Tercatat di Sepolia!
              </div>
              <div className="text-[11px] text-slate-300">
                Tx Hash: <span className="font-mono text-emerald-200">{realTxHash}</span>
              </div>
              <a
                href={getExplorerTxUrl(realTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline font-medium pt-1"
              >
                <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
                Buka Bukti Transaksi di Sepolia Etherscan
              </a>
            </div>
          )}

          {/* Tombol Eksekusi Web3 */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="text-xs text-slate-300">
              Dengan mengunci penetapan ini, smart contract akan mencatat vendor terpilih secara permanen. Status pemenang tidak dapat diubah secara sepihak untuk menjamin prinsip keadilan pengadaan.
            </div>

            <Button
              variant="primary"
              onClick={handleExecuteAwardWinner}
              disabled={submitting || verifying || isAlreadyAwarded}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                  Mengunci Pemenang via MetaMask...
                </>
              ) : isAlreadyAwarded ? (
                <>
                  <Lucide icon="CheckCircle2" className="w-4 h-4" />
                  Pemenang Sudah Terkunci di Blockchain
                </>
              ) : (
                <>
                  <Lucide icon="ShieldCheck" className="w-4 h-4" />
                  Kunci Penetapan Pemenang ke Sepolia (MetaMask)
                </>
              )}
            </Button>
          </div>

          {/* Salin Parameter Remix IDE */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Lucide icon="Code" className="w-3.5 h-3.5 text-purple-400" />
                Parameter Remix IDE (Uji Coba Penguji):
              </span>
              <button
                type="button"
                onClick={copyRemixInput}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px]"
              >
                <Lucide icon={copiedRemix ? "Check" : "Copy"} className="w-3 h-3" />
                {copiedRemix ? "Tersalin" : "Salin Parameter"}
              </button>
            </div>
            <div className="p-2 rounded bg-black/40 border border-slate-800 font-mono text-[10px] text-slate-300 break-all select-all">
              {remixFormattedInput}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-t border-slate-800 text-xs">
          <a
            href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
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
