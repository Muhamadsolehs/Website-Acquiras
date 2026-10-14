/**
 * Konfigurasi & Utilitas Arsitektur Hybrid Web2-Web3 ACQUIRAS 2025/2026
 * Smart Contract: AcquirasProcurement.sol
 */

export const BLOCKCHAIN_CONFIG = {
  enabled: true,
  contractAddress: import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS || "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47",
  networkName: import.meta.env.VITE_BLOCKCHAIN_NETWORK || "Polygon Amoy / Remix VM",
  chainId: 80002,
  explorerUrl: import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || "https://amoy.polygonscan.com",
};

/**
 * Format alamat atau transaction hash menjadi ringkas (contoh: 0xd914...39138)
 */
export function formatAddress(address: string, startChars = 6, endChars = 5): string {
  if (!address || address.length < startChars + endChars) return address || "-";
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Buat link ke Block Explorer
 */
export function getExplorerAddressUrl(address: string): string {
  return `${BLOCKCHAIN_CONFIG.explorerUrl}/address/${address}`;
}

export function getExplorerTxUrl(txHash: string): string {
  return `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${txHash}`;
}

/**
 * Menghasilkan SHA-256 hash representatif untuk dokumen / data lelang
 */
export async function computeSha256(data: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}
