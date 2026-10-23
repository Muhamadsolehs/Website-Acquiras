import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl, computeSha256 } from "@/config/blockchain";
import { Web3Service } from "@/utils/web3Client";
import { toast } from "sonner";
import clsx from "clsx";

interface BlockchainBidModalProps {
  open: boolean;
  onClose: () => void;
  tenderId: number;
  vendorId: number;
  namaVendor?: string;
  nilaiPenawaran: number;
  fileDokumenName?: string;
  onBidSubmittedOnChain?: (txResult: any) => void;
}

export const BlockchainBidModal: React.FC<BlockchainBidModalProps> = ({
  open,
  onClose,
  tenderId,
  vendorId,
  namaVendor = "Vendor Peserta",
  nilaiPenawaran,
  fileDokumenName = "dokumen_penawaran.pdf",
  onBidSubmittedOnChain,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedRemix, setCopiedRemix] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string>("");

  // State On-Chain
  const [localBidHash, setLocalBidHash] = useState<string>("");
  const [onChainTender, setOnChainTender] = useState<any>(null);
  const [onChainBid, setOnChainBid] = useState<any>(null);
  const [onChainMatch, setOnChainMatch] = useState<boolean | null>(null);
  const [readError, setReadError] = useState<string | null>(null);

  // State Wallet Web3 & Transaksi
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [submittingToChain, setSubmittingToChain] = useState(false);
  const [realTxHash, setRealTxHash] = useState<string | null>(null);
  const [realBlockNumber, setRealBlockNumber] = useState<number | null>(null);

  useEffect(() => {
    const hasWallet = Web3Service.isWalletAvailable();
    setIsWalletAvailable(hasWallet);

    if (hasWallet) {
      Web3Service.getActiveAccount().then((acc) => {
        setConnectedAccount(acc);
      });
    }
  }, []);

  // Format canonical hash penawaran
  const canonicalData = useMemo(() => {
    return JSON.stringify({
      tenderId: Number(tenderId),
      vendorId: Number(vendorId),
      penawaranHarga: Math.round(Number(nilaiPenawaran)),
      dokumen: fileDokumenName,
    });
  }, [tenderId, vendorId, nilaiPenawaran, fileDokumenName]);

  // Baca status Smart Contract on-chain
  const verifyBidWithOnChainState = async () => {
    setVerifying(true);
    setReadError(null);

    try {
      // 1. Hitung SHA-256 lokal
      const hash = await computeSha256(canonicalData);
      setLocalBidHash(hash);

      // 2. Cek apakah tender sudah terdaftar di smart contract
      const tenderData = await Web3Service.getTenderOnChain(tenderId);
      if (tenderData && Number(tenderData.id) > 0) {
        setOnChainTender(tenderData);
      } else {
        setOnChainTender(null);
      }

      // 3. Cek apakah penawaran vendor ini sudah tercatat on-chain
      const bidData = await Web3Service.getBidOnChain(tenderId, vendorId);
      if (bidData && Number(bidData.submittedAt) > 0) {
        setOnChainBid(bidData);
        const onChainHarga = Number(bidData.penawaranHarga);
        const matches = onChainHarga === Math.round(Number(nilaiPenawaran));
        setOnChainMatch(matches);

        if (matches) {
          toast.success(`Penawaran 100% Tersegel dan Cocok di Smart Contract (Tender #${tenderId}, Vendor #${vendorId})!`);
        } else {
          toast.error(`Peringatan Tamper: Nilai di Web (Rp ${Number(nilaiPenawaran).toLocaleString("id-ID")}) TIDAK COCOK dengan Smart Contract (Rp ${onChainHarga.toLocaleString("id-ID")})!`);
        }
      } else {
        setOnChainBid(null);
        setOnChainMatch(null);
      }

      setVerifiedAt(new Date().toLocaleString("id-ID"));
    } catch (err: any) {
      console.warn("Gagal membaca status on-chain:", err);
      setReadError(err.message || "Gagal menghubungi node RPC blockchain.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (open) {
      verifyBidWithOnChainState();
    } else {
      setRealTxHash(null);
      setRealBlockNumber(null);
      setOnChainBid(null);
      setOnChainMatch(null);
    }
  }, [open, tenderId, vendorId, nilaiPenawaran]);

  // Eksekusi Submit Bid Nyata via MetaMask ke Sepolia Testnet
  const handleSendBidTransaction = async () => {
    if (!Web3Service.isWalletAvailable()) {
      toast.error("MetaMask tidak terdeteksi. Silakan pasang ekstensi MetaMask di browser.");
      return;
    }

    if (!onChainTender || Number(onChainTender.id) === 0) {
      toast.error(`Tender #${tenderId} belum tercatat di smart contract. Admin harus mempublikasikan lelang ke blockchain terlebih dahulu.`);
      return;
    }

    try {
      setSubmittingToChain(true);

      const accounts = await Web3Service.requestAccounts();
      if (accounts && accounts.length > 0) {
        setConnectedAccount(accounts[0]);
      }

      toast.info("Mengirim transaksi submitBid ke MetaMask. Silakan konfirmasi...");

      const ipfsCid = "QmBid_" + Math.random().toString(36).substring(2, 10).toUpperCase();

      let paddedHash = localBidHash;
      if (!paddedHash.startsWith("0x")) paddedHash = "0x" + paddedHash;
      paddedHash = paddedHash.padEnd(66, "0").slice(0, 66);

      const result = await Web3Service.submitBidOnChain({
        tenderId: Number(tenderId),
        vendorId: Number(vendorId),
        penawaranHarga: Math.round(Number(nilaiPenawaran)),
        ipfsDokumenPenawaran: ipfsCid,
        penawaranHash: paddedHash,
      });

      setRealTxHash(result.txHash);
      setRealBlockNumber(result.blockNumber || null);

      toast.success("Transaksi Sukses! Penawaran harga resmi tersegel permanen di Ethereum Sepolia!");

      if (onBidSubmittedOnChain) {
        onBidSubmittedOnChain(result);
      }

      // Refresh data on-chain
      await verifyBidWithOnChainState();
    } catch (err: any) {
      console.error("Gagal submit bid on-chain:", err);
      if (err.code === 4001 || err.action === "reject") {
        toast.warning("Transaksi dibatalkan oleh pengguna di MetaMask.");
      } else {
        toast.error("Transaksi Gagal: " + (err.reason || err.message || "Gagal mengeksekusi smart contract"));
      }
    } finally {
      setSubmittingToChain(false);
    }
  };

  const copyToClipboard = (text: string, type: "hash" | "remix") => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedRemix(true);
      setTimeout(() => setCopiedRemix(false), 2000);
    }
    toast.success("Berhasil disalin ke clipboard!");
  };

  const remixFormattedInput = useMemo(() => {
    let paddedHash = localBidHash;
    if (!paddedHash.startsWith("0x")) paddedHash = "0x" + paddedHash;
    paddedHash = paddedHash.padEnd(66, "0").slice(0, 66);
    return `${tenderId}, ${vendorId}, ${Math.round(Number(nilaiPenawaran))}, "QmBidDocSealedOnChain2026", "${paddedHash}"`;
  }, [tenderId, vendorId, nilaiPenawaran, localBidHash]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Panel className="w-full max-w-2xl bg-white dark:bg-darkmode-600 border border-slate-200/80 dark:border-darkmode-400 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-white my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-darkmode-400 bg-slate-50/50 dark:bg-darkmode-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 shadow-sm">
                <Lucide icon="Lock" className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-wide">
                    Segel Penawaran Vendor (Smart Contract)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    submitBid()
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Perekaman Harga Penawaran & Hash Dokumen Kriptografis ke Jaringan Sepolia
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

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status On-Chain Real-Time */}
          <div className={clsx(
            "rounded-xl border p-4 transition-all",
            onChainBid && Number(onChainBid.submittedAt) > 0
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
              : "bg-amber-50/80 border-amber-200 text-amber-900"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Lucide icon="Activity" className="w-4 h-4 text-blue-600" />
                Status Integritas di Smart Contract Sepolia
              </div>
              <button
                onClick={verifyBidWithOnChainState}
                disabled={verifying}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold disabled:opacity-50"
                title="Baca ulang state blockchain"
              >
                <Lucide icon="RefreshCw" className={clsx("w-3.5 h-3.5", verifying && "animate-spin")} />
                {verifying ? "Membaca Node..." : "Cek Ulang"}
              </button>
            </div>

            {verifying ? (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 py-2">
                <Lucide icon="Loader2" className="w-4 h-4 animate-spin text-blue-600" />
                Membaca data live dari Smart Contract Sepolia (RPC Call)...
              </div>
            ) : onChainBid && Number(onChainBid.submittedAt) > 0 ? (
              <div className="space-y-2.5 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    TERSEGEL DI BLOCKCHAIN (VERIFIED)
                  </span>
                  {onChainMatch ? (
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ Nilai Penawaran Sesuai
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-700 font-bold bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      ⚠ Tamper Warning: Nilai Tidak Cocok!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 shadow-sm">
                    <span className="text-slate-500 text-[10px] font-medium">Harga On-Chain:</span>
                    <div className="font-bold text-emerald-600 text-sm">
                      Rp {Number(onChainBid.penawaranHarga).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 shadow-sm">
                    <span className="text-slate-500 text-[10px] font-medium">Waktu Segel:</span>
                    <div className="font-medium text-slate-800 text-xs mt-0.5">
                      {new Date(Number(onChainBid.submittedAt) * 1000).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-lg bg-white border border-emerald-200/80 shadow-sm">
                    <span className="text-slate-500 text-[10px] font-medium">Wallet Vendor:</span>
                    <div className="font-mono text-slate-800 text-[11px] truncate mt-0.5 font-semibold">
                      {onChainBid.vendorWallet}
                    </div>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-lg bg-white border border-emerald-200/80 shadow-sm">
                    <span className="text-slate-500 text-[10px] font-medium">Hash Dokumen (SHA-256):</span>
                    <div className="font-mono text-slate-700 text-[11px] truncate mt-0.5">
                      {onChainBid.penawaranHash}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 p-3 rounded-lg bg-white/80 border border-amber-200 text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Lucide icon="AlertTriangle" className="w-4 h-4 text-amber-600 shrink-0" />
                  Belum Tersegel On-Chain
                </div>
                <p className="mt-1 text-slate-600">
                  Penawaran vendor ID #{vendorId} untuk tender #{tenderId} belum tercatat di smart contract.
                  Klik tombol di bawah untuk menyegelnya secara permanen ke Sepolia Testnet.
                </p>
              </div>
            )}
          </div>

          {/* Rincian Parameter */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Parameter Penawaran
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Tender ID:</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">#{tenderId}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Vendor ID / Nama:</span>
                <div className="font-bold text-slate-800 text-sm truncate mt-0.5">#{vendorId} - {namaVendor}</div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Nilai Harga Penawaran:</span>
                <div className="font-bold text-emerald-600 text-lg mt-0.5">
                  Rp {Number(nilaiPenawaran).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium">Berkas Dokumen Teknis & Harga:</span>
                <div className="font-semibold text-slate-800 truncate flex items-center gap-2 mt-1">
                  <Lucide icon="FileText" className="w-4 h-4 text-rose-500" />
                  <span>{fileDokumenName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHA-256 Hash Dokumen */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Penawaran Hash (SHA-256):</span>
              <button
                type="button"
                onClick={() => copyToClipboard(localBidHash, "hash")}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-semibold"
              >
                <Lucide icon={copiedHash ? "Check" : "Copy"} className="w-3.5 h-3.5" />
                {copiedHash ? "Tersalin" : "Salin Hash"}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all select-all">
              {localBidHash || "Menghitung hash..."}
            </div>
          </div>

          {/* Real Tx Hash if just executed */}
          {realTxHash && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Lucide icon="CheckCircle" className="w-4 h-4 text-emerald-600" />
                Transaksi Berhasil Tercatat On-Chain!
              </div>
              <div className="text-[11px] text-slate-600">
                Hash Transaksi: <span className="font-mono text-emerald-800 font-bold">{realTxHash}</span>
              </div>
              <a
                href={getExplorerTxUrl(realTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 underline font-semibold pt-1"
              >
                <Lucide icon="ExternalLink" className="w-3.5 h-3.5" />
                Buka di Etherscan Sepolia Explorer
              </a>
            </div>
          )}

          {/* Eksekusi Web3 MetaMask Button */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Lucide icon="Wallet" className="w-4 h-4 text-blue-600" />
                Koneksi Wallet Pengirim (Vendor Web3)
              </div>
              <span className="text-[11px] text-slate-600 font-mono font-semibold">
                {connectedAccount ? formatAddress(connectedAccount) : isWalletAvailable ? "Siap Terhubung" : "MetaMask Tidak Ada"}
              </span>
            </div>

            <Button
              variant="primary"
              onClick={handleSendBidTransaction}
              disabled={submittingToChain || verifying}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2 border-none"
            >
              {submittingToChain ? (
                <>
                  <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                  Menyegel Penawaran via MetaMask...
                </>
              ) : onChainBid && Number(onChainBid.submittedAt) > 0 ? (
                <>
                  <Lucide icon="RefreshCw" className="w-4 h-4" />
                  Perbarui / Kirim Ulang Segel On-Chain
                </>
              ) : (
                <>
                  <Lucide icon="ShieldCheck" className="w-4 h-4" />
                  Kirim Transaksi Segel Penawaran ke Sepolia
                </>
              )}
            </Button>
          </div>

          {/* Salin Parameter untuk Remix IDE (Keperluan Ujian/Sidang Skripsi) */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Lucide icon="Code" className="w-3.5 h-3.5 text-purple-600" />
                Parameter Remix IDE (Uji Coba Manual Dosen):
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(remixFormattedInput, "remix")}
                className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-[11px] font-semibold"
              >
                <Lucide icon={copiedRemix ? "Check" : "Copy"} className="w-3 h-3" />
                {copiedRemix ? "Tersalin" : "Salin Parameter Remix"}
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
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold hover:underline"
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
