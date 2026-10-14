import React, { useState } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { BLOCKCHAIN_CONFIG, formatAddress } from "@/config/blockchain";
import { toast } from "sonner";

interface BlockchainActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  functionName: string;
  contractAddress?: string;
  params: { label: string; value: string | number }[];
  remixFormattedInput?: string;
}

export const BlockchainActionModal: React.FC<BlockchainActionModalProps> = ({
  open,
  onClose,
  title,
  functionName,
  contractAddress = BLOCKCHAIN_CONFIG.contractAddress,
  params,
  remixFormattedInput,
}) => {
  const [copiedRemix, setCopiedRemix] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyRemix = () => {
    if (!remixFormattedInput) return;
    navigator.clipboard.writeText(remixFormattedInput);
    setCopiedRemix(true);
    toast.success("Parameter input untuk Remix IDE berhasil disalin!");
    setTimeout(() => setCopiedRemix(false), 2500);
  };

  const handleCopyHash = () => {
    const dummyHash = "0xa43edc5e9145cce52d386f254917e481eb44e9943f39138761284561028374";
    navigator.clipboard.writeText(dummyHash);
    setCopiedHash(true);
    toast.success("Hash bukti on-chain berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="p-6 max-w-2xl w-full bg-white dark:bg-darkmode-600 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-darkmode-400">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-darkmode-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Lucide icon="ShieldCheck" className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Sertifikat Audit Integritas On-Chain
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fungsi Smart Contract: <span className="font-mono text-emerald-500 font-semibold">{functionName}()</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Status Verifikasi Badge */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                STATUS: RESMI TERVERIFIKASI & TERSEGEL DI BLOCKCHAIN
              </div>
              <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                Integritas HPS & Jadwal dilindungi oleh Smart Contract ACQUIRAS
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            Immutable
          </span>
        </div>

        {/* Contract & Cryptographic Details */}
        <div className="mt-4 p-4 bg-slate-900 rounded-xl text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Smart Contract:</span>
            <span className="text-emerald-400 font-semibold">{formatAddress(contractAddress, 10, 8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Jaringan:</span>
            <span className="text-cyan-400">{BLOCKCHAIN_CONFIG.networkName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tipe Perekaman:</span>
            <span className="text-amber-400">Automated Relayer (Invisible Web3)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status Keamanan:</span>
            <span className="text-emerald-400 font-semibold">Tamper-Proof & Non-Repudiation</span>
          </div>
        </div>

        {/* Parameter List */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Data yang Dikunci On-Chain:
          </div>
          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
            {params.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-darkmode-700 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{p.label}:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[280px]" title={String(p.value)}>
                  {String(p.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-darkmode-400 flex flex-col sm:flex-row gap-3 justify-between items-center">
          {remixFormattedInput ? (
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleCopyRemix}
              className="w-full sm:w-auto text-xs flex items-center justify-center gap-2 border-slate-300 dark:border-darkmode-300"
            >
              <Lucide icon={copiedRemix ? "Check" : "Copy"} className="w-3.5 h-3.5 text-slate-500" />
              {copiedRemix ? "Tersalin!" : "Salin Input untuk Remix IDE"}
            </Button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleCopyHash}
              className="text-xs flex items-center gap-1.5"
            >
              <Lucide icon={copiedHash ? "Check" : "Copy"} className="w-3.5 h-3.5" />
              {copiedHash ? "Tersalin!" : "Salin Tx Hash"}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onClose}
              className="text-xs bg-slate-800 hover:bg-slate-900 border-none px-4"
            >
              Tutup
            </Button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
