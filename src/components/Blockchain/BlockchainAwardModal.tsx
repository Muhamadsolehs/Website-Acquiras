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
      <Dialog.Panel className="w-full max-w-xl bg-white dark:bg-darkmode-600 border border-slate-200/80 dark:border-darkmode-400 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-white my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shadow-sm">
                <Lucide icon="Trophy" className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-wide">
                    Penetapan Pemenang Lelang
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    awardWinner()
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Penguncian Pemenang & Berita Acara Hasil Pemilihan (BAHP) ke Blockchain
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-darkmode-500 transition-colors"
            >
              <Lucide icon="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status On-Chain Live */}
          <div className={clsx(
            "rounded-xl border p-4 transition-all",
            isAlreadyAwarded
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
              : "bg-blue-50/80 border-blue-200 text-blue-950"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Lucide icon="Activity" className="w-4 h-4 text-emerald-600" />
                Status Smart Contract Sepolia
              </div>
              <button
                onClick={checkTenderState}
                disabled={verifying}
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
              >
                <Lucide icon="RefreshCw" className={clsx("w-3.5 h-3.5", verifying && "animate-spin")} />
                {verifying ? "Mengecek..." : "Perbarui"}
              </button>
            </div>

            {verifying ? (
              <div className="flex items-center gap-2 text-xs text-slate-600 py-1">
                <Lucide icon="Loader2" className="w-4 h-4 animate-spin text-emerald-600" />
                Membaca status terkini dari blockchain Sepolia...
              </div>
            ) : isAlreadyAwarded ? (
              <div className="p-3 rounded-lg bg-white border border-emerald-200 text-slate-800 text-xs space-y-1 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <Lucide icon="CheckCircle2" className="w-4 h-4 text-emerald-600" />
                  Pemenang Telah Terkunci di Blockchain!
                </div>
                <div className="mt-1">
                  Pemenang Sah On-Chain:{" "}
                  <span className="font-bold text-slate-900">Vendor ID #{Number(onChainTender.winnerVendorId)}</span>
                </div>
                {isCurrentWinner ? (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Vendor Ini Terkonfirmasi Sebagai Pemenang Resmi
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ⚠ Pemenang yang terkunci adalah Vendor #{Number(onChainTender.winnerVendorId)}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-white/80 border border-blue-200 text-blue-900 text-xs shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-blue-800">
                  <Lucide icon="Info" className="w-4 h-4 text-blue-600 shrink-0" />
                  Belum Ada Pemenang yang Dikunci On-Chain
                </div>
                <p className="mt-1 text-slate-600">
                  Tender #{tenderId} berada pada status Published. Siap untuk dikunci dengan penetapan pemenang lelang.
                </p>
              </div>
            )}
          </div>

          {/* Rincian Pemenang */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rincian Calon Pemenang
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Tender ID:</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">#{tenderId}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Vendor Pemenang:</span>
                <div className="font-bold text-emerald-600 text-sm truncate mt-0.5">
                  #{winnerVendorId} - {namaVendor}
                </div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Harga Kontrak / Penawaran Final:</span>
                <div className="font-bold text-emerald-600 text-lg mt-0.5">
                  Rp {Number(finalPrice).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          {/* Transaksi Sukses */}
          {realTxHash && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Lucide icon="CheckCircle" className="w-4 h-4 text-emerald-600" />
                Transaksi Sukses Tercatat di Sepolia!
              </div>
              <div className="text-[11px] text-slate-600">
                Tx Hash: <span className="font-mono text-emerald-800 font-bold">{realTxHash}</span>
              </div>
              <a
                href={getExplorerTxUrl(realTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline font-semibold pt-1"
              >
                <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
                Buka Bukti Transaksi di Sepolia Etherscan
              </a>
            </div>
          )}

          {/* Tombol Eksekusi Web3 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
            <div className="text-xs text-slate-600">
              Dengan mengunci penetapan ini, smart contract akan mencatat vendor terpilih secara permanen. Status pemenang tidak dapat diubah secara sepihak untuk menjamin prinsip keadilan pengadaan.
            </div>

            <Button
              variant="primary"
              onClick={handleExecuteAwardWinner}
              disabled={submitting || verifying || isAlreadyAwarded}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 border-none"
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
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Lucide icon="Code" className="w-3.5 h-3.5 text-purple-600" />
                Parameter Remix IDE (Uji Coba Penguji):
              </span>
              <button
                type="button"
                onClick={copyRemixInput}
                className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-[11px] font-semibold"
              >
                <Lucide icon={copiedRemix ? "Check" : "Copy"} className="w-3 h-3" />
                {copiedRemix ? "Tersalin" : "Salin Parameter"}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-200 break-all select-all">
              {remixFormattedInput}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200 text-xs">
          <a
            href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold hover:underline"
          >
            <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
            Kontrak: {formatAddress(BLOCKCHAIN_CONFIG.contractAddress)}
          </a>
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Tutup
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
