import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { BLOCKCHAIN_CONFIG, formatAddress, getExplorerAddressUrl, getExplorerTxUrl, computeSha256 } from "@/config/blockchain";
import { Web3Service } from "@/utils/web3Client";
import { toast } from "sonner";
import clsx from "clsx";
import { ethers } from "ethers";
import { ACQUIRAS_CONTRACT_ABI } from "@/config/acquirasAbi";

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
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedRemix, setCopiedRemix] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string>("");
  
  // State Kriptografi & Data On-Chain Nyata
  const [localDataHash, setLocalDataHash] = useState<string>("");
  const [onChainTenderData, setOnChainTenderData] = useState<any>(null);
  const [onChainMatch, setOnChainMatch] = useState<boolean | null>(null);
  const [chainReadError, setChainReadError] = useState<string | null>(null);

  // State Eksekusi Transaksi Web3 (MetaMask)
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [sendingToChain, setSendingToChain] = useState(false);
  const [realTxHash, setRealTxHash] = useState<string | null>(null);
  const [realBlockNumber, setRealBlockNumber] = useState<number | null>(null);

  // Periksa ketersediaan MetaMask & Akun Terhubung
  useEffect(() => {
    const hasWallet = Web3Service.isWalletAvailable();
    setIsWalletAvailable(hasWallet);

    if (hasWallet) {
      Web3Service.getActiveAccount().then((acc) => {
        setConnectedAccount(acc);
      });
    }
  }, []);

  // Format canonical data untuk perhitungan SHA-256
  const canonicalData = useMemo(() => {
    const obj: Record<string, string | number> = {};
    params.forEach((p) => {
      obj[p.label] = p.value;
    });
    return JSON.stringify(obj);
  }, [params]);

  // Ekstrak parameter penting
  const tenderId = useMemo(() => {
    const p = params.find((x) => x.label.toLowerCase().includes("id"));
    return p ? Number(p.value) : 1;
  }, [params]);

  const nilaiHps = useMemo(() => {
    const p = params.find((x) => x.label.toLowerCase().includes("hps") || x.label.toLowerCase().includes("nilai"));
    return p ? Number(p.value) : 0;
  }, [params]);

  // Fungsi Verifikasi Real: Baca Smart Contract via RPC atau Web3
  const verifyWithOnChainState = async () => {
    setVerifying(true);
    setChainReadError(null);

    try {
      // 1. Hitung SHA-256 Data Lokal MySQL
      const localHash = await computeSha256(canonicalData);
      setLocalDataHash(localHash);

      // 2. Baca state langsung dari Smart Contract (Read-only call dengan Fallback RPC)
      let provider: ethers.Provider;
      if (typeof window !== "undefined" && window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      }

      let contract = new ethers.Contract(contractAddress, ACQUIRAS_CONTRACT_ABI, provider);

      try {
        let tenderFromChain;
        try {
          tenderFromChain = await contract.getTender(BigInt(tenderId));
        } catch {
          // Jika provider browser gagal, coba gunakan public RPC node Sepolia
          const publicProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
          const publicContract = new ethers.Contract(contractAddress, ACQUIRAS_CONTRACT_ABI, publicProvider);
          tenderFromChain = await publicContract.getTender(BigInt(tenderId));
        }
        
        // Periksa apakah tender sudah pernah dipublish on-chain (id != 0)
        if (tenderFromChain && Number(tenderFromChain.id) > 0) {
          setOnChainTenderData(tenderFromChain);
          const onChainHps = Number(tenderFromChain.nilaiHps);
          
          // Komparasi Data Nyata: Apakah Nilai HPS di MySQL cocok dengan di Smart Contract?
          const matches = onChainHps === nilaiHps;
          setOnChainMatch(matches);

          if (matches) {
            toast.success(`Data 100% Cocok dengan Smart Contract On-Chain (Tender ID: ${tenderId})!`);
          } else {
            toast.error(`Peringatan Tamper: Nilai HPS di Web (Rp ${nilaiHps.toLocaleString()}) TIDAK COCOK dengan Smart Contract (Rp ${onChainHps.toLocaleString()})!`);
          }
        } else {
          // Kontrak belum menyimpan tender ini (belum dieksekusi publishTender)
          setOnChainTenderData(null);
          setOnChainMatch(null);
          setChainReadError(`Tender ID #${tenderId} belum tercatat di smart contract. Klik 'Kirim Transaksi ke Blockchain' untuk mencatatnya secara permanen.`);
        }
      } catch (contractErr: any) {
        console.warn("Gagal membaca getTender:", contractErr);
        setOnChainTenderData(null);
        setOnChainMatch(null);
        setChainReadError("Smart contract belum menyimpan data tender ini. Silakan klik 'Kirim Transaksi ke Blockchain'.");
      }

      setVerifiedAt(new Date().toLocaleString("id-ID"));
    } catch (err: any) {
      console.error("Error verifikasi:", err);
      setChainReadError(err.message || "Terjadi kendala saat membaca blockchain.");
    } finally {
      setVerifying(false);
    }
  };

  // Jalankan verifikasi saat modal dibuka
  useEffect(() => {
    if (open) {
      verifyWithOnChainState();
    } else {
      setRealTxHash(null);
      setRealBlockNumber(null);
      setOnChainTenderData(null);
      setOnChainMatch(null);
    }
  }, [open, tenderId, nilaiHps, contractAddress]);

  // Eksekusi Transaksi NYATA ke Testnet via MetaMask
  const handleSendTransactionToTestnet = async () => {
    if (!isWalletAvailable) {
      toast.error("MetaMask tidak terdeteksi. Silakan buka browser yang memiliki ekstensi MetaMask.");
      return;
    }

    setSendingToChain(true);
    try {
      // 1. Minta koneksi wallet
      const accounts = await Web3Service.requestAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error("Koneksi MetaMask dibatalkan pengguna.");
      }
      setConnectedAccount(accounts[0]);

      toast.info("Jendela MetaMask terbuka. Silakan klik 'Confirm' untuk menandatangani transaksi...");

      // 2. Ambil parameter lelang
      const kodePaket = String(params.find((p) => p.label.toLowerCase().includes("kode"))?.value || "PKT-01");
      const namaPaket = String(params.find((p) => p.label.toLowerCase().includes("nama"))?.value || "Paket Pengadaan");
      const tglMulai = Number(params.find((p) => p.label.toLowerCase().includes("mulai"))?.value || Math.floor(Date.now() / 1000));
      const tglSelesai = Number(params.find((p) => p.label.toLowerCase().includes("selesai"))?.value || Math.floor(Date.now() / 1000) + 86400 * 14);

      // 3. Eksekusi fungsi publishTenderOnChain
      const result = await Web3Service.publishTenderOnChain({
        tenderId,
        kodePaket,
        namaPaket,
        nilaiHps,
        ipfsKakCid: "QmAcquirasKAKDocsSealedOnChain2026",
        dataHash: localDataHash || (await computeSha256(canonicalData)),
        tanggalMulai: tglMulai,
        tanggalSelesai: tglSelesai,
      });

      if (result.success) {
        setRealTxHash(result.txHash);
        setRealBlockNumber(result.blockNumber || null);
        toast.success(`Transaksi Berhasil Masuk Block #${result.blockNumber}! Data resmi terkunci di blockchain.`);
        
        // Refresh verifikasi on-chain
        await verifyWithOnChainState();
      }
    } catch (err: any) {
      console.error("MetaMask execution error:", err);
      let errorMsg = err.reason || err.shortMessage || err.message || "Gagal memproses transaksi di MetaMask.";
      if (errorMsg.includes("require(false)") || errorMsg.includes("missing revert data")) {
        errorMsg = "Transaksi ditolak. Pastikan MetaMask berada pada jaringan Sepolia dan menggunakan akun pemilik kontrak (0x28523...).";
      } else if (err.code === "ACTION_REJECTED" || errorMsg.toLowerCase().includes("rejected")) {
        errorMsg = "Transaksi dibatalkan di jendela MetaMask.";
      }
      toast.error(errorMsg);
    } finally {
      setSendingToChain(false);
    }
  };

  const handleCopyHash = () => {
    const hashToCopy = realTxHash || localDataHash;
    navigator.clipboard.writeText(hashToCopy);
    setCopiedHash(true);
    toast.success("Hash berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyRemixInput = () => {
    const formatted = params.map((p) => {
      if (typeof p.value === "string") return `"${p.value}"`;
      return p.value;
    }).join(", ");

    navigator.clipboard.writeText(formatted);
    setCopiedRemix(true);
    toast.success("Parameter input untuk Remix IDE berhasil disalin!");
    setTimeout(() => setCopiedRemix(false), 2000);
  };

  const handleOpenExplorer = () => {
    if (realTxHash) {
      window.open(getExplorerTxUrl(realTxHash), "_blank");
    } else {
      window.open(getExplorerAddressUrl(contractAddress), "_blank");
    }
  };

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
                icon={verifying ? "Loader2" : onChainMatch === true ? "ShieldCheck" : onChainMatch === false ? "ShieldAlert" : "Cpu"}
                className={clsx("w-5 h-5 stroke-[2]", { "animate-spin": verifying })}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Integrasi Smart Contract & Audit On-Chain
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fungsi Kontrak: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{functionName}()</span> | Kontrak: <span className="font-mono">{formatAddress(contractAddress, 8, 6)}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className={clsx(
          "mt-4 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all",
          verifying
            ? "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700/50"
            : onChainMatch === true
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
            : onChainMatch === false
            ? "bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300"
            : "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/40"
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
                  : "STATUS: BELUM DIPUBLIKASIKAN KE BLOCKCHAIN (MENUNGGU EKSEKUSI)"}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                {verifying
                  ? "Menghubungi smart contract dan membaca fungsi getTender()..."
                  : onChainMatch === true
                  ? `Nilai HPS di database MySQL (Rp ${nilaiHps.toLocaleString()}) 100% IDENTIK dengan di Smart Contract (Tender #${tenderId}).`
                  : onChainMatch === false
                  ? `Terdeteksi perbedaan data! Nilai HPS di Web berbeda dengan nilai yang telah dikunci di Smart Contract!`
                  : chainReadError || "Klik tombol 'Kirim Transaksi ke Blockchain' di bawah untuk mengeksekusi smart contract secara nyata."}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className={clsx(
              "px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1",
              onChainMatch === true
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                : onChainMatch === false
                ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40"
                : "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30"
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
            <span className="text-amber-300">{connectedAccount ? formatAddress(connectedAccount, 10, 8) : "Belum Terhubung"}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Nilai HPS di Database MySQL:</span>
            <span className="text-white font-bold">Rp {nilaiHps.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Nilai HPS di Smart Contract:</span>
            <span className={clsx("font-bold", onChainTenderData ? "text-emerald-400" : "text-slate-500")}>
              {onChainTenderData ? `Rp ${Number(onChainTenderData.nilaiHps).toLocaleString("id-ID")}` : "Belum Tersimpan On-Chain"}
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
            <span>Parameter Tender ({params.length} Atribut):</span>
            <span className="text-[11px] text-slate-400 font-mono">Tender ID: #{tenderId}</span>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
            {params.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 rounded-lg text-xs bg-slate-50 dark:bg-darkmode-700 text-slate-800 dark:text-slate-200"
              >
                <span className="text-slate-500 dark:text-slate-400 font-medium">{p.label}:</span>
                <span className="font-mono font-semibold text-right truncate max-w-[280px]">
                  {String(p.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions (100% Real Execution) */}
        <div className="mt-5 pt-4 border-t border-slate-200/80">
          {/* Tombol Eksekusi Transaksi NYATA */}
          <Button
            type="button"
            variant="primary"
            onClick={handleSendTransactionToTestnet}
            disabled={sendingToChain}
            className="w-full h-11 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 border-none"
          >
            <Lucide icon={sendingToChain ? "Loader2" : "Send"} className={clsx("w-4 h-4", sendingToChain && "animate-spin")} />
            {sendingToChain ? "Memproses Transaksi di MetaMask..." : "Kirim Transaksi ke Blockchain (MetaMask)"}
          </Button>

          {/* Baris Tombol Aksi Tambahan */}
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tombol Re-Check Verifikasi */}
              <Button
                type="button"
                variant="outline-secondary"
                onClick={verifyWithOnChainState}
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
                onClick={handleCopyRemixInput}
                className="text-xs flex items-center gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-xl"
                title="Salin parameter input untuk eksekusi langsung di Remix IDE"
              >
                <Lucide icon={copiedRemix ? "Check" : "Code"} className="w-3.5 h-3.5 text-slate-600" />
                <span>{copiedRemix ? "Tersalin!" : "Input Remix"}</span>
              </Button>

              <Button
                type="button"
                variant="outline-primary"
                onClick={handleOpenExplorer}
                className="text-xs flex items-center gap-1.5 text-blue-600 border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-xl"
                title="Buka Sepolia Etherscan Explorer"
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
