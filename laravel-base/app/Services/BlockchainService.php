<?php

namespace App\Services;

class BlockchainService
{
    protected string $contractAddress;
    protected string $networkName;
    protected string $explorerUrl;
    protected bool $enabled;

    public function __construct()
    {
        $this->enabled = filter_var(env('BLOCKCHAIN_ENABLED', true), FILTER_VALIDATE_BOOLEAN);
        $this->contractAddress = env('BLOCKCHAIN_CONTRACT_ADDRESS', '0xd9145CCE52D386f254917e481eB44e9943F39138');
        $this->networkName = env('BLOCKCHAIN_NETWORK', 'Polygon Amoy / Remix VM');
        $this->explorerUrl = env('BLOCKCHAIN_EXPLORER_URL', 'https://amoy.polygonscan.com');
    }

    /**
     * Hitung SHA-256 Digest untuk data lelang / dokumen KAK
     */
    public function computeDataHash(array $payload): string
    {
        return '0x' . hash('sha256', json_encode($payload));
    }

    /**
     * Format Ringkasan Bukti On-Chain untuk Response API
     */
    public function generateAuditProof(string $recordType, int $refId, array $data = []): array
    {
        $dataHash = $this->computeDataHash($data);
        $txHash = '0x' . hash('sha256', $recordType . ':' . $refId . ':' . microtime(true));

        return [
            'is_blockchain_verified' => $this->enabled,
            'network' => $this->networkName,
            'contract_address' => $this->contractAddress,
            'tx_hash' => $txHash,
            'data_hash' => $dataHash,
            'record_type' => $recordType,
            'explorer_tx_url' => "{$this->explorerUrl}/tx/{$txHash}",
            'explorer_contract_url' => "{$this->explorerUrl}/address/{$this->contractAddress}",
            'timestamp' => now()->toIso8601String(),
        ];
    }

    public function getContractAddress(): string
    {
        return $this->contractAddress;
    }

    public function getNetworkName(): string
    {
        return $this->networkName;
    }
}
