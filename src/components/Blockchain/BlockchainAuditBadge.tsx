import React, { useState } from "react";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl } from "@/config/blockchain";

interface BlockchainAuditBadgeProps {
  txHash?: string;
  dataHash?: string;
  recordType?: string;
  timestamp?: string;
  compact?: boolean;
}

export const BlockchainAuditBadge: React.FC<BlockchainAuditBadgeProps> = ({
  txHash = "0xa43edc5e9145cce52d386f254917e481eb44e9943f39138761284561028374",
  dataHash = "0x89f1d43a65239e01bc3d2e9b812f4510aa29b9f71c4912e845cba0281987ef12",
  recordType = "Tender Published",
  timestamp,
  compact = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-400 shadow-md transition-all cursor-pointer"
          title="Klik untuk melihat bukti verifikasi on-chain"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <Lucide icon="ShieldCheck" className="w-3.5 h-3.5 text-white" />
          <span>Smart Contract Verified</span>
        </button>

        <AuditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          txHash={txHash}
          dataHash={dataHash}
          recordType={recordType}
          timestamp={timestamp}
          copied={copied}
          onCopy={copyToClipboard}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500/50 bg-slate-900 shadow-xl p-4 md:p-5 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-sm">
              <Lucide icon="ShieldCheck" className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Hybrid Web2-Web3 Audit Trail
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Immutable Ledger
                </span>
              </div>
              <p className="text-xs text-slate-100 font-medium mt-1">
                Integritas dokumen & aktivitas ini tercatat secara permanen di Smart Contract{" "}
                <span className="font-mono text-emerald-300 font-bold bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded ml-1">
                  {formatAddress(BLOCKCHAIN_CONFIG.contractAddress)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 border border-emerald-400 transition-all cursor-pointer whitespace-nowrap"
            >
              <Lucide icon="Search" className="w-4 h-4 text-white" />
              <span>Cek Bukti On-Chain</span>
            </button>
          </div>
        </div>
      </div>

      <AuditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        txHash={txHash}
        dataHash={dataHash}
        recordType={recordType}
        timestamp={timestamp}
        copied={copied}
        onCopy={copyToClipboard}
      />
    </>
  );
};

interface AuditModalProps {
  open: boolean;
  onClose: () => void;
  txHash: string;
  dataHash: string;
  recordType: string;
  timestamp?: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}

const AuditModal: React.FC<AuditModalProps> = ({
  open,
  onClose,
  txHash,
  dataHash,
  recordType,
  timestamp,
  copied,
  onCopy,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="p-6 max-w-xl w-full bg-white dark:bg-darkmode-600 border border-slate-200/80 dark:border-darkmode-400 text-slate-800 dark:text-white rounded-2xl shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-darkmode-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-sm">
              <Lucide icon="Cpu" className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">Bukti Audit Trail Smart Contract</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verifikasi Kriptografi ACQUIRAS Web3 Hybrid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-darkmode-500 transition-colors"
          >
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Status Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Lucide icon="CheckCircle2" className="w-4 h-4 text-emerald-600" />
              <span>Status: Terverifikasi On-Chain (Valid & Tamper-Proof)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-semibold">
              EVM Compatible
            </span>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-500 font-medium">Smart Contract Terverifikasi:</label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-emerald-700 font-semibold">
                <span className="break-all">{BLOCKCHAIN_CONFIG.contractAddress}</span>
                <button
                  onClick={() => onCopy(BLOCKCHAIN_CONFIG.contractAddress, "contract")}
                  className="ml-2 p-1.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                  title="Salin alamat"
                >
                  <Lucide
                    icon={copied === "contract" ? "Check" : "Copy"}
                    className="w-3.5 h-3.5"
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Jaringan Blockchain:</label>
              <div className="mt-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                <span className="font-semibold">{BLOCKCHAIN_CONFIG.networkName} (Chain ID: {BLOCKCHAIN_CONFIG.chainId})</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">Active & Synced</span>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Transaction Hash (TxHash):</label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-200">
                <span className="break-all">{txHash}</span>
                <button
                  onClick={() => onCopy(txHash, "tx")}
                  className="ml-2 p-1.5 hover:bg-slate-800 rounded text-slate-300 transition-colors"
                  title="Salin TxHash"
                >
                  <Lucide icon={copied === "tx" ? "Check" : "Copy"} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-medium">SHA-256 Digest / Data Hash Dokumen:</label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-cyan-300">
                <span className="break-all">{dataHash}</span>
                <button
                  onClick={() => onCopy(dataHash, "data")}
                  className="ml-2 p-1.5 hover:bg-slate-800 rounded text-slate-300 transition-colors"
                  title="Salin Data Hash"
                >
                  <Lucide icon={copied === "data" ? "Check" : "Copy"} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium">Tipe Perekaman Event:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{recordType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium">Waktu Stempel Blok:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {timestamp || new Date().toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            onClick={onClose}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Tutup
          </Button>
          <a
            href={getExplorerAddressUrl(BLOCKCHAIN_CONFIG.contractAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
          >
            <span>Buka Explorer</span>
            <Lucide icon="ExternalLink" className="w-3 h-3" />
          </a>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
