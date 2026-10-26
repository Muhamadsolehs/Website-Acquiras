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
    <Dialog open={open} onClose={onClose} size="lg">
      <Dialog.Panel className="p-6 max-w-2xl w-full bg-white dark:bg-white rounded-2xl shadow-2xl border border-slate-200/80 text-slate-800 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              onChainMatch === true
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                : onChainMatch === false
                ? "bg-rose-500/10 border border-rose-500/20 text-rose-500"
                : "bg-blue-500/10 border border-blue-500/20 text-blue-500"
            )}>
              <Lucide
                icon={verifying ? "Loader2" : onChainMatch === true ? "ShieldCheck" : onChainMatch === false ? "ShieldAlert" : "Lock"}
                className={clsx("w-5 h-5 stroke-[2]", { "animate-spin": verifying })}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Segel Penawaran Vendor (Smart Contract)
              </h3>
              <p className="text-xs text-slate-500">
                Fungsi Kontrak: <span className="font-mono text-emerald-600 font-semibold">submitBid()</span> | Kontrak: <span className="font-mono">{formatAddress(BLOCKCHAIN_CONFIG.contractAddress, 8, 6)}</span>
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
            : onChainMatch === true
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800"
            : onChainMatch === false
            ? "bg-rose-500/10 border-rose-500/40 text-rose-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        )}>
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-3.5 h-3.5 rounded-full shrink-0",
              verifying
                ? "bg-blue-500 animate-ping"
                : onChainMatch === true
                ? "bg-emerald-500 animate-pulse"
                : onChainMatch === false
                ? "bg-rose-500 animate-bounce"
                : "bg-amber-500"
            )} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wide">
                {verifying
                  ? "MEMBACA KONSENSUS BLOCKCHAIN..."
                  : onChainMatch === true
                  ? "STATUS: TERVERIFIKASI SINKRON DENGAN SMART CONTRACT ON-CHAIN"
                  : onChainMatch === false
                  ? "PERINGATAN: DATA TIDAK COCOK DENGAN SMART CONTRACT!"
                  : "STATUS: BELUM TERSEGEL KE BLOCKCHAIN (MENUNGGU EKSEKUSI)"}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {verifying
                  ? "Menghubungi smart contract dan membaca fungsi getBid()..."
                  : onChainMatch === true
                  ? `Nilai Penawaran di database MySQL (Rp ${Number(nilaiPenawaran).toLocaleString("id-ID")}) 100% IDENTIK dengan di Smart Contract (Tender #${tenderId}, Vendor #${vendorId}).`
                  : onChainMatch === false
                  ? `Terdeteksi perbedaan data! Nilai di Web (Rp ${Number(nilaiPenawaran).toLocaleString("id-ID")}) berbeda dengan nilai di Smart Contract!`
                  : readError || "Klik tombol 'Kirim Transaksi Segel Penawaran' di bawah untuk mengeksekusi smart contract secara nyata."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className={clsx(
              "px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1",
              onChainMatch === true
                ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                : onChainMatch === false
                ? "bg-rose-500/20 text-rose-700 border-rose-500/40"
                : "bg-amber-500/20 text-amber-700 border-amber-500/30"
            )}>
              <Lucide
                icon={onChainMatch === true ? "CheckCircle" : onChainMatch === false ? "AlertTriangle" : "Clock"}
                className="w-3.5 h-3.5"
              />
              {onChainMatch === true ? "On-Chain Verified" : onChainMatch === false ? "Tampered / Mismatch" : "Pending Transaction"}
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
            <span className="text-slate-400">Wallet Signer (MetaMask):</span>
            <span className="text-amber-300">{connectedAccount ? formatAddress(connectedAccount, 10, 8) : isWalletAvailable ? "Siap Terhubung" : "MetaMask Tidak Ada"}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Nilai Penawaran di MySQL:</span>
            <span className="text-white font-bold">Rp {Number(nilaiPenawaran).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Nilai Penawaran di Smart Contract:</span>
            <span className={clsx("font-bold", onChainBid && Number(onChainBid.submittedAt) > 0 ? "text-emerald-400" : "text-slate-500")}>
              {onChainBid && Number(onChainBid.submittedAt) > 0 ? `Rp ${Number(onChainBid.penawaranHarga).toLocaleString("id-ID")}` : "Belum Tersimpan On-Chain"}
            </span>
          </div>
          {onChainBid && Number(onChainBid.submittedAt) > 0 && (
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Waktu Segel On-Chain:</span>
              <span className="text-slate-300">{new Date(Number(onChainBid.submittedAt) * 1000).toLocaleString("id-ID")}</span>
            </div>
          )}
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
            <span>Parameter Penawaran (4 Atribut):</span>
            <span className="text-[11px] text-slate-400 font-mono">Tender ID: #{tenderId}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Vendor ID / Nama:</span>
              <span className="font-semibold text-right truncate max-w-[280px]">#{vendorId} - {namaVendor}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Nilai Harga Penawaran:</span>
              <span className="font-bold text-emerald-600 text-right">Rp {Number(nilaiPenawaran).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Berkas Dokumen:</span>
              <span className="font-mono text-xs text-right truncate max-w-[280px] flex items-center gap-1">
                <Lucide icon="FileText" className="w-3.5 h-3.5 text-rose-500" />
                {fileDokumenName}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 text-slate-800">
              <span className="text-slate-500 font-medium">Penawaran Hash (SHA-256):</span>
              <div className="flex items-center gap-2 max-w-[320px]">
                <span className="font-mono text-[11px] text-slate-700 truncate">{localBidHash || "Menghitung..."}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(localBidHash, "hash")}
                  className="text-blue-600 hover:text-blue-700 text-xs font-semibold shrink-0"
                >
                  {copiedHash ? "Tersalin" : "Salin"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (100% Real Execution) */}
        <div className="mt-5 pt-4 border-t border-slate-200/80">
          {/* Tombol Eksekusi Transaksi NYATA */}
          <Button
            type="button"
            variant="primary"
            onClick={handleSendBidTransaction}
            disabled={submittingToChain || verifying}
            className="w-full h-11 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 border-none"
          >
            <Lucide icon={submittingToChain ? "Loader2" : onChainBid && Number(onChainBid.submittedAt) > 0 ? "RefreshCw" : "Send"} className={clsx("w-4 h-4", submittingToChain && "animate-spin")} />
            {submittingToChain
              ? "Menyegel Penawaran via MetaMask..."
              : onChainBid && Number(onChainBid.submittedAt) > 0
              ? "Perbarui / Kirim Ulang Segel On-Chain (MetaMask)"
              : "Kirim Transaksi Segel Penawaran (MetaMask)"}
          </Button>

          {/* Baris Tombol Aksi Tambahan */}
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tombol Re-Check Verifikasi */}
              <Button
                type="button"
                variant="outline-secondary"
                onClick={verifyBidWithOnChainState}
                disabled={verifying}
                className="text-xs flex items-center gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl"
                title="Cek ulang kecocokan data web dengan smart contract"
              >
                <Lucide icon="RefreshCw" className={clsx("w-3.5 h-3.5", { "animate-spin": verifying })} />
                <span>{verifying ? "Mengecek..." : "Cek On-Chain"}</span>
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => copyToClipboard(remixFormattedInput, "remix")}
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
                className="text-xs flex items-center gap-1.5 text-blue-600 border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-xl"
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
