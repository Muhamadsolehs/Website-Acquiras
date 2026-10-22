import { ethers } from "ethers";
import { BLOCKCHAIN_CONFIG, computeSha256 } from "@/config/blockchain";
import { ACQUIRAS_CONTRACT_ABI } from "@/config/acquirasAbi";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface PublishTenderPayload {
  tenderId: number;
  kodePaket: string;
  namaPaket: string;
  nilaiHps: number;
  ipfsKakCid: string;
  dataHash?: string;
  tanggalMulai: string | number;
  tanggalSelesai: string | number;
}

export interface SubmitBidPayload {
  tenderId: number;
  vendorId: number;
  penawaranHarga: number;
  ipfsDokumenPenawaran: string;
  penawaranHash?: string;
}

export interface AwardWinnerPayload {
  tenderId: number;
  winnerVendorId: number;
  finalPrice: number;
  ipfsBeritaAcara: string;
}

export interface RecordSignaturePayload {
  refId: number;
  docType: string;
  documentHash: string;
  signerName: string;
  bsreCertId: string;
}

export interface RecordMilestoneInvoicePayload {
  kontrakId: number;
  terminKe: number;
  noPenagihan: string;
  jumlahTagihan: number;
  ipfsBapCid?: string;
}

export interface ApproveMilestonePayload {
  kontrakId: number;
  terminKe: number;
  noSpb: string;
}

export interface TxResult {
  success: boolean;
  txHash: string;
  blockNumber?: number;
  explorerUrl: string;
  dataHash?: string;
  message?: string;
}

export class Web3Service {
  /**
   * Cek apakah Web3 wallet (MetaMask) tersedia di browser
   */
  static isWalletAvailable(): boolean {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  }

  /**
   * Ambil Provider dari Browser (MetaMask)
   */
  static getProvider(): ethers.BrowserProvider {
    if (!this.isWalletAvailable()) {
      throw new Error("MetaMask tidak terdeteksi di browser. Silakan pasang ekstensi MetaMask.");
    }
    return new ethers.BrowserProvider(window.ethereum);
  }

  /**
   * Minta akses koneksi akun dari wallet
   */
  static async requestAccounts(): Promise<string[]> {
    if (!this.isWalletAvailable()) {
      throw new Error("MetaMask tidak terdeteksi. Silakan pasang ekstensi MetaMask di browser.");
    }
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  /**
   * Ambil akun yang sedang aktif
   */
  static async getActiveAccount(): Promise<string | null> {
    if (!this.isWalletAvailable()) return null;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      return accounts && accounts.length > 0 ? accounts[0] : null;
    } catch {
      return null;
    }
  }

  /**
   * Buat instance Contract terhubung dengan Signer aktif
   */
  static async getContractWithSigner(): Promise<{ contract: ethers.Contract; signer: ethers.Signer; address: string }> {
    const provider = this.getProvider();
    const signer = await provider.getSigner();
    const contractAddress = BLOCKCHAIN_CONFIG.contractAddress;
    const contract = new ethers.Contract(contractAddress, ACQUIRAS_CONTRACT_ABI, signer);
    return { contract, signer, address: contractAddress };
  }

  /**
   * Pastikan MetaMask berada pada jaringan yang sesuai (Sepolia / 11155111)
   */
  static async ensureTargetNetwork(): Promise<void> {
    if (!this.isWalletAvailable()) return;
    const targetChainId = BLOCKCHAIN_CONFIG.chainId || 11155111;
    const chainIdHex = "0x" + targetChainId.toString(16);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdHex,
              chainName: BLOCKCHAIN_CONFIG.networkName,
              rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com", "https://rpc.sepolia.org"],
              nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: [BLOCKCHAIN_CONFIG.explorerUrl],
            },
          ],
        });
      }
    }
  }

  /**
   * 1. FITUR PUBLISH TENDER ON-CHAIN (publishTender)
   */
  static async publishTenderOnChain(payload: PublishTenderPayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    let dataHash = payload.dataHash;
    if (!dataHash || dataHash.length !== 66) {
      dataHash = await computeSha256(
        JSON.stringify({
          id: payload.tenderId,
          kode: payload.kodePaket,
          nama: payload.namaPaket,
          hps: payload.nilaiHps,
          kak: payload.ipfsKakCid,
        })
      );
    }
    if (!dataHash.startsWith("0x")) dataHash = "0x" + dataHash;
    dataHash = dataHash.padEnd(66, "0").slice(0, 66);

    const tglMulai = typeof payload.tanggalMulai === "number" && !isNaN(payload.tanggalMulai)
      ? payload.tanggalMulai
      : Math.floor(Date.now() / 1000);

    const tglSelesai = typeof payload.tanggalSelesai === "number" && !isNaN(payload.tanggalSelesai)
      ? payload.tanggalSelesai
      : Math.floor(Date.now() / 1000) + 86400 * 14;

    const ipfsCid = payload.ipfsKakCid || "QmAcquirasKAKDocsSealedOnChain2026";

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.publishTender(
      BigInt(payload.tenderId),
      payload.kodePaket,
      payload.namaPaket,
      BigInt(Math.round(payload.nilaiHps)),
      ipfsCid,
      dataHash,
      BigInt(tglMulai),
      BigInt(tglSelesai),
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      dataHash,
      message: "Paket lelang berhasil dikunci permanen di smart contract!",
    };
  }

  /**
   * 2. FITUR SUBMIT PENAWARAN ON-CHAIN (submitBid)
   */
  static async submitBidOnChain(payload: SubmitBidPayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    let penawaranHash = payload.penawaranHash;
    if (!penawaranHash || penawaranHash.length !== 66) {
      penawaranHash = await computeSha256(
        JSON.stringify({
          tenderId: payload.tenderId,
          vendorId: payload.vendorId,
          harga: payload.penawaranHarga,
          doc: payload.ipfsDokumenPenawaran,
        })
      );
    }
    if (!penawaranHash.startsWith("0x")) penawaranHash = "0x" + penawaranHash;
    penawaranHash = penawaranHash.padEnd(66, "0").slice(0, 66);

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.submitBid(
      BigInt(payload.tenderId),
      BigInt(payload.vendorId),
      BigInt(Math.round(payload.penawaranHarga)),
      payload.ipfsDokumenPenawaran || "QmBidDocsEncrypted2026",
      penawaranHash,
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      dataHash: penawaranHash,
      message: "Dokumen penawaran harga berhasil disegel dan dicatat di blockchain!",
    };
  }

  /**
   * 3. FITUR PENETAPAN PEMENANG (awardWinner)
   */
  static async awardWinnerOnChain(payload: AwardWinnerPayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.awardWinner(
      BigInt(payload.tenderId),
      BigInt(payload.winnerVendorId),
      BigInt(Math.round(payload.finalPrice)),
      payload.ipfsBeritaAcara || "QmBeritaAcaraPemenangLelang2026",
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      message: "Penetapan pemenang lelang resmi terkunci secara hukum digital on-chain!",
    };
  }

  /**
   * 4. FITUR DIGITAL SIGNATURE / TTE KONTRAK (recordSignature)
   */
  static async recordSignatureOnChain(payload: RecordSignaturePayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    let docHash = payload.documentHash;
    if (!docHash.startsWith("0x")) docHash = "0x" + docHash;
    docHash = docHash.padEnd(66, "0").slice(0, 66);

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.recordSignature(
      BigInt(payload.refId),
      payload.docType,
      docHash,
      payload.signerName,
      payload.bsreCertId,
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      dataHash: docHash,
      message: "TTE & Hash Dokumen Kontrak resmi diverifikasi on-chain!",
    };
  }

  /**
   * 5. FITUR PENCATATAN TAGIHAN TERMIN (recordMilestoneInvoice)
   */
  static async recordMilestoneInvoiceOnChain(payload: RecordMilestoneInvoicePayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.recordMilestoneInvoice(
      BigInt(payload.kontrakId),
      payload.terminKe,
      payload.noPenagihan,
      BigInt(Math.round(payload.jumlahTagihan)),
      payload.ipfsBapCid || "QmBAPTermin_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      message: "Surat tagihan / BAP termin resmi tercatat di smart contract!",
    };
  }

  /**
   * 6. FITUR PERSETUJUAN PEMBAYARAN TERMIN (approveMilestonePayment)
   */
  static async approveMilestonePaymentOnChain(payload: ApproveMilestonePayload): Promise<TxResult> {
    await this.ensureTargetNetwork();

    const { contract } = await this.getContractWithSigner();

    const tx = await contract.approveMilestonePayment(
      BigInt(payload.kontrakId),
      payload.terminKe,
      payload.noSpb,
      { gasLimit: 2500000n }
    );

    const receipt = await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      explorerUrl: `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${tx.hash}`,
      message: "Persetujuan pembayaran SPB termin berhasil dieksekusi di smart contract!",
    };
  }

  /**
   * Helper untuk membuat read-only contract instance dengan fallback Public Sepolia RPC
   */
  static getReadOnlyContract(): ethers.Contract {
    let provider: ethers.Provider;
    if (this.isWalletAvailable()) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    }
    return new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, ACQUIRAS_CONTRACT_ABI, provider);
  }

  /**
   * BACA DATA TENDER LANGSUNG DARI SMART CONTRACT (getTender)
   */
  static async getTenderOnChain(tenderId: number) {
    try {
      const contract = this.getReadOnlyContract();
      return await contract.getTender(BigInt(tenderId));
    } catch {
      const publicProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const publicContract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, ACQUIRAS_CONTRACT_ABI, publicProvider);
      return await publicContract.getTender(BigInt(tenderId));
    }
  }

  /**
   * BACA DATA PENAWARAN VENDOR LANGSUNG DARI SMART CONTRACT (getBid)
   */
  static async getBidOnChain(tenderId: number, vendorId: number) {
    try {
      const contract = this.getReadOnlyContract();
      return await contract.getBid(BigInt(tenderId), BigInt(vendorId));
    } catch {
      const publicProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const publicContract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, ACQUIRAS_CONTRACT_ABI, publicProvider);
      return await publicContract.getBid(BigInt(tenderId), BigInt(vendorId));
    }
  }

  /**
   * BACA DATA TERMIN / ESCROW LANGSUNG DARI SMART CONTRACT (getMilestone)
   */
  static async getMilestoneOnChain(kontrakId: number, terminKe: number) {
    try {
      const contract = this.getReadOnlyContract();
      return await contract.getMilestone(BigInt(kontrakId), terminKe);
    } catch {
      const publicProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const publicContract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, ACQUIRAS_CONTRACT_ABI, publicProvider);
      return await publicContract.getMilestone(BigInt(kontrakId), terminKe);
    }
  }

  /**
   * VERIFIKASI KEASLIAN HASH DOKUMEN (verifyDocumentHash)
   */
  static async verifyDocumentHashOnChain(documentHash: string): Promise<boolean> {
    let hash = documentHash;
    if (!hash.startsWith("0x")) hash = "0x" + hash;
    hash = hash.padEnd(66, "0").slice(0, 66);

    try {
      const contract = this.getReadOnlyContract();
      return await contract.verifyDocumentHash(hash);
    } catch {
      const publicProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const publicContract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, ACQUIRAS_CONTRACT_ABI, publicProvider);
      return await publicContract.verifyDocumentHash(hash);
    }
  }
}
