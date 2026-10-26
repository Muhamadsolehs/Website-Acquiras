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
    <Dialog open={open} onClose={onClose} size="lg">
      <Dialog.Panel className="p-6 max-w-2xl w-full bg-white dark:bg-white rounded-2xl shadow-2xl border border-slate-200/80 text-slate-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isAlreadyAwarded
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                : "bg-blue-500/10 border border-blue-500/20 text-blue-500"
            )}>
              <Lucide icon="Trophy" className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Penetapan Pemenang Lelang (Smart Contract)
              </h3>
              <p className="text-xs text-slate-500">
                Fungsi Kontrak: <span className="font-mono text-emerald-600 font-semibold">awardWinner()</span> | Kontrak: <span className="font-mono">{formatAddress(BLOCKCHAIN_CONFIG.contractAddress, 8, 6)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className={clsx(
          "mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all",
          verifying
            ? "bg-blue-50 border-blue-200 text-blue-800"
            : isAlreadyAwarded
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        )}>
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-3.5 h-3.5 rounded-full shrink-0",
              verifying
                ? "bg-blue-500 animate-ping"
                : isAlreadyAwarded
                ? "bg-emerald-500 animate-pulse"
                : "bg-amber-500"
            )} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wide">
                {verifying
                  ? "MEMBACA KONSENSUS BLOCKCHAIN..."
                  : isAlreadyAwarded
                  ? "STATUS: PEMENANG RESMI TERKUNCI ON-CHAIN"
                  : "STATUS: MENUNGGU EKSEKUSI PENETAPAN PEMENANG"}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {verifying
                  ? "Menghubungi smart contract dan membaca fungsi getTender()..."
                  : isAlreadyAwarded
                  ? isCurrentWinner
                    ? `Vendor #${winnerVendorId} (${namaVendor}) telah sah terkunci sebagai pemenang tender #${tenderId} di Ethereum Sepolia.`
                    : `Peringatan: Pemenang yang tercatat on-chain adalah Vendor #${Number(onChainTender.winnerVendorId)}.`
                  : "Tender belum memiliki pemenang di blockchain. Klik tombol eksekusi di bawah untuk menguncinya secara permanen."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className={clsx(
              "px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1",
              isAlreadyAwarded
                ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-700 border-amber-500/30"
            )}>
              <Lucide
                icon={isAlreadyAwarded ? "CheckCircle" : "Clock"}
                className="w-3.5 h-3.5"
              />
              {isAlreadyAwarded ? "Awarded On-Chain" : "Pending Execution"}
            </span>
          </div>
        </div>

        {/* Real Data Comparison Table */}
        <div className="mt-4 p-4 bg-slate-900 rounded-xl text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
          <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2">
            <span className="text-slate-400">Jaringan Target:</span>
            <span className="text-cyan-400 font-bold">{BLOCKCHAIN_CONFIG.networkName} (Chain ID: {BLOCKCHAIN_CONFIG.chainId})</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Calon Pemenang:</span>
            <span className="text-amber-300 font-semibold">#{winnerVendorId} - {namaVendor}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Nilai Kontrak Akhir:</span>
            <span className="text-white font-bold">Rp {Number(finalPrice).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Status Pemenang On-Chain:</span>
            <span className={clsx("font-bold", isAlreadyAwarded ? "text-emerald-400" : "text-slate-500")}>
              {isAlreadyAwarded ? `Terkunci (Vendor ID #${Number(onChainTender.winnerVendorId)})` : "Belum Dikunci On-Chain"}
            </span>
          </div>
          {realTxHash && (
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
              <span className="text-slate-400">Tx Hash Resmi:</span>
              <a
                href={getExplorerTxUrl(realTxHash)}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                {formatAddress(realTxHash, 10, 8)}
                <Lucide icon="ExternalLink" className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Parameter List yang Disimpan */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Rincian Calon Pemenang:</span>
            <span className="text-[11px] text-slate-400 font-mono">Tender ID: #{tenderId}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Vendor Pemenang:</span>
              <span className="font-semibold text-right truncate max-w-[280px]">#{winnerVendorId} - {namaVendor}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Nilai Kontrak / Penawaran Final:</span>
              <span className="font-bold text-emerald-600 text-right">Rp {Number(finalPrice).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Dokumen BAHP (IPFS CID):</span>
              <span className="font-mono text-xs text-right truncate max-w-[280px]">QmBeritaAcaraPemenangLelang2026</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-200/80">
          <Button
            type="button"
            variant="primary"
            onClick={handleExecuteAwardWinner}
            disabled={submitting || verifying || isAlreadyAwarded}
            className="w-full h-11 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 border-none disabled:opacity-50"
          >
            <Lucide icon={submitting ? "Loader2" : isAlreadyAwarded ? "CheckCircle2" : "ShieldCheck"} className={clsx("w-4 h-4", submitting && "animate-spin")} />
            {submitting
              ? "Mengunci Pemenang via MetaMask..."
              : isAlreadyAwarded
              ? "Pemenang Sudah Terkunci di Blockchain"
              : "Kunci Penetapan Pemenang (MetaMask)"}
          </Button>

          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={checkTenderState}
                disabled={verifying}
                className="text-xs flex items-center gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl"
                title="Cek ulang status tender di blockchain"
              >
                <Lucide icon="RefreshCw" className={clsx("w-3.5 h-3.5", { "animate-spin": verifying })} />
                <span>{verifying ? "Mengecek..." : "Cek On-Chain"}</span>
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={copyRemixInput}
                className="text-xs flex items-center gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl"
                title="Salin parameter input untuk eksekusi langsung di Remix IDE"
              >
                <Lucide icon={copiedRemix ? "Check" : "Code"} className="w-3.5 h-3.5 text-slate-600" />
                <span>{copiedRemix ? "Tersalin!" : "Input Remix"}</span>
              </Button>

              <Button
                type="button"
                variant="outline-primary"
                onClick={() => window.open(getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress), "_blank")}
                className="text-xs flex items-center gap-1.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50 px-3 py-2 rounded-xl"
                title="Buka Etherscan Sepolia Explorer"
              >
                <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
                <span>Explorer</span>
              </Button>
            </div>

            <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0"
            >
              Tutup
            </Button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
