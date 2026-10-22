import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { FormInput } from "@/components/Base/Form";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl } from "@/config/blockchain";
import { Web3Service } from "@/utils/web3Client";
import { toast } from "sonner";
import clsx from "clsx";

interface BlockchainMilestoneModalProps {
  open: boolean;
  onClose: () => void;
  kontrakId: number;
  terminKe: number;
  noPenagihan: string;
  jumlahTagihan: number;
  invoiceId: number;
  onPaymentApprovedOnChain?: (result: any) => void;
}

export const BlockchainMilestoneModal: React.FC<BlockchainMilestoneModalProps> = ({
  open,
  onClose,
  kontrakId,
  terminKe,
  noPenagihan,
  jumlahTagihan,
  invoiceId,
  onPaymentApprovedOnChain,
}) => {
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [onChainMilestone, setOnChainMilestone] = useState<any>(null);
  const [noSpb, setNoSpb] = useState<string>(`SPB/KTR-${kontrakId}/TERM-${terminKe}/${new Date().getFullYear()}`);
  const [realTxHash, setRealTxHash] = useState<string | null>(null);
  const [copiedRemix, setCopiedRemix] = useState(false);

  const checkMilestoneState = async () => {
    try {
      setVerifying(true);
      const data = await Web3Service.getMilestoneOnChain(kontrakId, terminKe);
      if (data && (Number(data.jumlahTagihan) > 0 || Number(data.status) > 0 || Number(data.paidAt) > 0)) {
        setOnChainMilestone(data);
      } else {
        setOnChainMilestone(null);
      }
    } catch (err) {
      console.warn("Gagal membaca milestone on-chain:", err);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (open) {
      setNoSpb(`SPB/KTR-${kontrakId}/TERM-${terminKe}/${new Date().getFullYear()}`);
      setRealTxHash(null);
      checkMilestoneState();
    }
  }, [open, kontrakId, terminKe]);

  // Eksekusi approveMilestonePayment langsung via MetaMask
  const handleApprovePayment = async () => {
    if (!Web3Service.isWalletAvailable()) {
      toast.error("MetaMask tidak terdeteksi. Silakan pasang ekstensi MetaMask.");
      return;
    }

    if (!noSpb.trim()) {
      toast.error("Nomor SPB (Surat Perintah Bayar) wajib diisi!");
      return;
    }

    try {
      setSubmitting(true);

      // Jika tagihan belum pernah dicatat on-chain, catat dulu agar state konsisten
      if (!onChainMilestone || Number(onChainMilestone.jumlahTagihan) === 0) {
        toast.info("1/2 Mencatat pengajuan tagihan ke smart contract (recordMilestoneInvoice)...");
        await Web3Service.recordMilestoneInvoiceOnChain({
          kontrakId,
          terminKe,
          noPenagihan,
          jumlahTagihan,
        });
      }

      toast.info("2/2 Membuka MetaMask untuk otorisasi Surat Perintah Bayar (approveMilestonePayment)...");

      const result = await Web3Service.approveMilestonePaymentOnChain({
        kontrakId: Number(kontrakId),
        terminKe: Number(terminKe),
        noSpb: noSpb.trim(),
      });

      setRealTxHash(result.txHash);
      toast.success("Pencairan dana / SPB termin resmi tercatat dan disahkan di Ethereum Sepolia!");

      if (onPaymentApprovedOnChain) {
        onPaymentApprovedOnChain({ ...result, noSpb: noSpb.trim() });
      }

      await checkMilestoneState();
    } catch (err: any) {
      console.error("Gagal approve milestone on-chain:", err);
      let errorMsg = err.reason || err.shortMessage || err.message || "Gagal mengeksekusi transaksi.";
      if (err.code === 4001 || errorMsg.includes("rejected")) {
        toast.warning("Transaksi dibatalkan oleh pengguna di MetaMask.");
      } else if (errorMsg.includes("Not authorized as admin") || errorMsg.includes("require(false)")) {
        toast.error("Akses Ditolak: Hanya wallet Admin/Deployer kontrak (0x28523...) yang berwenang menerbitkan SPB On-Chain.");
      } else {
        toast.error("Gagal: " + errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isAlreadyPaid = onChainMilestone && (Number(onChainMilestone.status) === 1 || Number(onChainMilestone.paidAt) > 0);

  const remixApproveParams = `${kontrakId}, ${terminKe}, "${noSpb}"`;

  const copyRemixParameters = () => {
    navigator.clipboard.writeText(remixApproveParams);
    setCopiedRemix(true);
    toast.success("Parameter Remix berhasil disalin!");
    setTimeout(() => setCopiedRemix(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <Dialog.Panel className="p-6 w-full max-w-2xl mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-darkmode-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Lucide icon="Coins" className="w-5 h-5" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white">
                Release Escrow & Otorisasi SPB Termin On-Chain
              </Dialog.Title>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Ethereum Sepolia Testnet</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="font-mono text-emerald-600">Method: approveMilestonePayment()</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-darkmode-400 transition"
          >
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Info Kontrak & Termin */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-darkmode-700/60 border border-slate-200/60 dark:border-darkmode-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-medium">ID Kontrak:</span>
              <p className="font-bold text-slate-800 dark:text-white font-mono mt-0.5">#{kontrakId}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-medium">Termin Ke:</span>
              <p className="font-bold text-primary mt-0.5">Termin #{terminKe}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-medium">No Penagihan:</span>
              <p className="font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5 font-mono">{noPenagihan}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-medium">Jumlah Tagihan:</span>
              <p className="font-bold text-emerald-600 mt-0.5">
                Rp {Number(jumlahTagihan).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* Status Live di Smart Contract */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live State di Smart Contract:
            </span>
            <button
              type="button"
              onClick={checkMilestoneState}
              disabled={verifying}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Lucide icon="RefreshCw" className={clsx("w-3 h-3", verifying && "animate-spin")} />
              <span>Refresh Status</span>
            </button>
          </div>

          {verifying ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-darkmode-700 text-center text-xs text-slate-400">
              <Lucide icon="Loader2" className="w-4 h-4 animate-spin inline mr-1 text-primary" />
              Memeriksa buku besar Sepolia...
            </div>
          ) : isAlreadyPaid ? (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/50">
              <div className="flex items-start gap-3">
                <Lucide icon="CheckCircle2" className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 dark:text-emerald-300">
                  <div className="font-bold text-sm">TEROTORISASI & LUNAS ON-CHAIN</div>
                  <p className="mt-1">
                    Termin ini telah disahkan oleh Pejabat Pembuat Komitmen (PPK). Dana escrow telah disetujui untuk dicairkan kepada penyedia.
                  </p>
                  <div className="mt-2 font-mono text-[11px] space-y-0.5">
                    <div>No SPB: <span className="font-bold">{onChainMilestone.noSpb || noSpb}</span></div>
                    {Number(onChainMilestone.paidAt) > 0 && (
                      <div>Disahkan pada: {new Date(Number(onChainMilestone.paidAt) * 1000).toLocaleString("id-ID")}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
              <Lucide icon="AlertTriangle" className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Menunggu Otorisasi Pembayaran (Escrow Pending)</span>
                <p className="mt-0.5">
                  Surat tagihan telah diverifikasi secara fisik. PPK / Bagian Keuangan dapat mengeksekusi penerbitan Surat Perintah Bayar (SPB) di bawah ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form Penerbitan SPB */}
        {!isAlreadyPaid && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nomor Surat Perintah Bayar (SPB / SPM)
              </label>
              <FormInput
                type="text"
                value={noSpb}
                onChange={(e) => setNoSpb(e.target.value)}
                placeholder="Contoh: SPB/2026/001-TERM-1"
                className="mt-1 font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Nomor ini akan dicatat ke dalam variabel <code className="text-primary font-mono">noSpb</code> pada smart contract.
              </span>
            </div>
          </div>
        )}

        {/* Real Tx Hash Banner */}
        {realTxHash && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <Lucide icon="CheckCircle" className="w-4 h-4 text-emerald-600" />
              Transaksi Berhasil Terkonfirmasi!
            </div>
            <div className="mt-1 font-mono text-[11px] break-all text-slate-600 dark:text-slate-300">
              Tx: {realTxHash}
            </div>
            <a
              href={getExplorerTxUrl(realTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              <span>Lihat Bukti Transaksi di Sepolia Etherscan</span>
              <Lucide icon="ExternalLink" className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Backup: Copy Remix IDE Parameters */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-darkmode-700/50 border border-slate-200 dark:border-darkmode-500 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Lucide icon="Code" className="w-3.5 h-3.5 text-primary" />
              Parameter Eksekusi Manual di Remix IDE:
            </span>
            <button
              type="button"
              onClick={copyRemixParameters}
              className="text-[11px] text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <Lucide icon={copiedRemix ? "Check" : "Copy"} className="w-3 h-3" />
              <span>{copiedRemix ? "Tersalin!" : "Salin Parameter"}</span>
            </button>
          </div>
          <pre className="mt-1.5 p-2 bg-slate-100 dark:bg-darkmode-800 rounded font-mono text-[10px] text-slate-700 dark:text-slate-300 overflow-x-auto">
            {remixApproveParams}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-darkmode-400">
          <a
            href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 font-mono"
          >
            <Lucide icon="ExternalLink" className="w-3 h-3" />
            <span>Kontrak: {formatAddress(BLOCKCHAIN_CONFIG.contractAddress)}</span>
          </a>

          <div className="flex gap-2">
            <Button variant="outline-secondary" onClick={onClose} disabled={submitting}>
              Tutup
            </Button>
            {!isAlreadyPaid && (
              <Button
                variant="primary"
                onClick={handleApprovePayment}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                    <span>Menandatangani di MetaMask...</span>
                  </>
                ) : (
                  <>
                    <Lucide icon="CheckCircle" className="w-4 h-4" />
                    <span>Terbitkan SPB & Eksekusi Escrow</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
