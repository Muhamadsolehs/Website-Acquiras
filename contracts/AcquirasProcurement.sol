// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AcquirasProcurement
 * @dev Smart Contract Hybrid Web2-Web3 untuk E-Procurement ACQUIRAS 2025/2026.
 * Mencakup modul:
 * 1. Tender Management (Publish Tender, Kualifikasi)
 * 2. Bid Submission (Perekaman Hash Penawaran Dokumen Teknis & Harga)
 * 3. Awarding (Penetapan Pemenang Lelang)
 * 4. Digital Signature Audit (Perekaman TTE / BSrE & Verifikasi Hash Kontrak)
 * 5. Milestone & Escrow Penagihan (Audit Surat Jalan, BAP, SPB Termin)
 *
 * Dirancang untuk di-deploy di jaringan Testnet (Polygon Amoy / Base Sepolia / Sepolia)
 * secara GRATIS menggunakan Remix IDE.
 */

contract AcquirasProcurement {
    // --- STATUS ENUMS ---
    enum TenderStatus { Draft, Published, Evaluation, Awarded, Completed, Cancelled }
    enum BidStatus { Submitted, Evaluated, Disqualified, Winner }
    enum MilestoneStatus { Pending, Verified, Paid }

    // --- STRUCTS ---
    struct Tender {
        uint256 id;
        string kodePaket;           // Contoh: PKT-SRV-01
        string namaPaket;
        uint256 nilaiHps;           // Nilai HPS dalam Rupiah (integer)
        string ipfsKakCid;          // IPFS Hash KAK / Dokumen Pemilihan
        bytes32 dataHash;           // SHA-256 Hash ringkasan spesifikasi
        uint256 tanggalMulai;
        uint256 tanggalSelesai;
        TenderStatus status;
        uint256 winnerVendorId;
        address registeredBy;
        uint256 createdAt;
    }

    struct Bid {
        uint256 tenderId;
        uint256 vendorId;
        address vendorWallet;
        uint256 penawaranHarga;
        string ipfsDokumenPenawaran; // IPFS CID dokumen penawaran
        bytes32 penawaranHash;       // Hash enkripsi penawaran sebelum pembukaan
        uint256 submittedAt;
        BidStatus status;
    }

    struct SignatureRecord {
        uint256 refId;               // lelang_id atau kontrak_id
        string docType;              // 'KONTRAK', 'BAP', 'SURAT_JALAN', 'SPB'
        bytes32 documentHash;        // SHA-256 dari PDF dokumen
        string signerName;
        address signerWallet;
        string bsreCertId;           // ID Sertifikat BSrE / TTE
        uint256 signedAt;
    }

    struct MilestonePayment {
        uint256 kontrakId;
        uint8 terminKe;              // 1, 2, atau 3
        string noPenagihan;          // No Invoice / Penagihan
        uint256 jumlahTagihan;
        string ipfsBapCid;           // Berita Acara Pembayaran di IPFS
        string noSpb;                // Surat Perintah Bayar
        MilestoneStatus status;
        uint256 paidAt;
    }

    // --- STATE VARIABLES ---
    address public owner;
    mapping(address => bool) public authorizedAdmins;

    // Mappings data
    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => mapping(uint256 => Bid)) public bids; // tenderId => vendorId => Bid
    mapping(uint256 => uint256[]) private tenderVendorParticipants;
    
    // Audit Records
    SignatureRecord[] public signatureRecords;
    mapping(bytes32 => bool) public isDocumentHashVerified;

    // Milestones (kontrakId => terminKe => MilestonePayment)
    mapping(uint256 => mapping(uint8 => MilestonePayment)) public milestonePayments;

    // --- EVENTS (Untuk didengar oleh Backend / Web2 Auditor) ---
    event TenderPublished(uint256 indexed tenderId, string kodePaket, uint256 nilaiHps, string ipfsKakCid, bytes32 dataHash);
    event BidSubmitted(uint256 indexed tenderId, uint256 indexed vendorId, address vendorWallet, bytes32 penawaranHash, string ipfsCid);
    event TenderAwarded(uint256 indexed tenderId, uint256 indexed winnerVendorId, uint256 finalPrice, string ipfsBeritaAcara);
    event DocumentSigned(uint256 indexed refId, string docType, bytes32 documentHash, address signer, string bsreCertId);
    event MilestoneRecorded(uint256 indexed kontrakId, uint8 terminKe, string noPenagihan, uint256 jumlahTagihan);
    event PaymentApproved(uint256 indexed kontrakId, uint8 terminKe, string noSpb, uint256 timestamp);

    // --- MODIFIERS ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner || authorizedAdmins[msg.sender], "Not authorized as admin");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedAdmins[msg.sender] = true;
    }

    function setAdmin(address adminAddress, bool status) external onlyOwner {
        authorizedAdmins[adminAddress] = status;
    }

    // ==========================================
    // 1. TENDER MANAGEMENT (TenderContract)
    // ==========================================
    function publishTender(
        uint256 _tenderId,
        string calldata _kodePaket,
        string calldata _namaPaket,
        uint256 _nilaiHps,
        string calldata _ipfsKakCid,
        bytes32 _dataHash,
        uint256 _tanggalMulai,
        uint256 _tanggalSelesai
    ) external onlyAdmin {
        require(tenders[_tenderId].id == 0, "Tender ID already exists");

        tenders[_tenderId] = Tender({
            id: _tenderId,
            kodePaket: _kodePaket,
            namaPaket: _namaPaket,
            nilaiHps: _nilaiHps,
            ipfsKakCid: _ipfsKakCid,
            dataHash: _dataHash,
            tanggalMulai: _tanggalMulai,
            tanggalSelesai: _tanggalSelesai,
            status: TenderStatus.Published,
            winnerVendorId: 0,
            registeredBy: msg.sender,
            createdAt: block.timestamp
        });

        emit TenderPublished(_tenderId, _kodePaket, _nilaiHps, _ipfsKakCid, _dataHash);
    }

    // ==========================================
    // 2. BID SUBMISSION (BidContract)
    // ==========================================
    function submitBid(
        uint256 _tenderId,
        uint256 _vendorId,
        uint256 _penawaranHarga,
        string calldata _ipfsDokumenPenawaran,
        bytes32 _penawaranHash
    ) external {
        Tender storage tender = tenders[_tenderId];
        require(tender.id != 0, "Tender not found");
        require(tender.status == TenderStatus.Published, "Tender is not in submission period");
        require(bids[_tenderId][_vendorId].submittedAt == 0, "Bid already submitted for this vendor");

        bids[_tenderId][_vendorId] = Bid({
            tenderId: _tenderId,
            vendorId: _vendorId,
            vendorWallet: msg.sender,
            penawaranHarga: _penawaranHarga,
            ipfsDokumenPenawaran: _ipfsDokumenPenawaran,
            penawaranHash: _penawaranHash,
            submittedAt: block.timestamp,
            status: BidStatus.Submitted
        });

        tenderVendorParticipants[_tenderId].push(_vendorId);

        emit BidSubmitted(_tenderId, _vendorId, msg.sender, _penawaranHash, _ipfsDokumenPenawaran);
    }

    // ==========================================
    // 3. AWARDING (AwardContract)
    // ==========================================
    function awardWinner(
        uint256 _tenderId,
        uint256 _winnerVendorId,
        uint256 _finalPrice,
        string calldata _ipfsBeritaAcara
    ) external onlyAdmin {
        Tender storage tender = tenders[_tenderId];
        require(tender.id != 0, "Tender not found");
        require(tender.status == TenderStatus.Published || tender.status == TenderStatus.Evaluation, "Invalid tender status");

        tender.status = TenderStatus.Awarded;
        tender.winnerVendorId = _winnerVendorId;

        if (bids[_tenderId][_winnerVendorId].submittedAt > 0) {
            bids[_tenderId][_winnerVendorId].status = BidStatus.Winner;
        }

        emit TenderAwarded(_tenderId, _winnerVendorId, _finalPrice, _ipfsBeritaAcara);
    }

    // ==========================================
    // 4. SIGNATURE AUDIT TRAIL (SignatureContract)
    // ==========================================
    function recordSignature(
        uint256 _refId,
        string calldata _docType,
        bytes32 _documentHash,
        string calldata _signerName,
        string calldata _bsreCertId
    ) external {
        signatureRecords.push(SignatureRecord({
            refId: _refId,
            docType: _docType,
            documentHash: _documentHash,
            signerName: _signerName,
            signerWallet: msg.sender,
            bsreCertId: _bsreCertId,
            signedAt: block.timestamp
        }));

        isDocumentHashVerified[_documentHash] = true;

        emit DocumentSigned(_refId, _docType, _documentHash, msg.sender, _bsreCertId);
    }

    // ==========================================
    // 5. ESCROW / PENAGIHAN TERMIN (EscrowContract)
    // ==========================================
    function recordMilestoneInvoice(
        uint256 _kontrakId,
        uint8 _terminKe,
        string calldata _noPenagihan,
        uint256 _jumlahTagihan,
        string calldata _ipfsBapCid
    ) external {
        milestonePayments[_kontrakId][_terminKe] = MilestonePayment({
            kontrakId: _kontrakId,
            terminKe: _terminKe,
            noPenagihan: _noPenagihan,
            jumlahTagihan: _jumlahTagihan,
            ipfsBapCid: _ipfsBapCid,
            noSpb: "",
            status: MilestoneStatus.Pending,
            paidAt: 0
        });

        emit MilestoneRecorded(_kontrakId, _terminKe, _noPenagihan, _jumlahTagihan);
    }

    function approveMilestonePayment(
        uint256 _kontrakId,
        uint8 _terminKe,
        string calldata _noSpb
    ) external onlyAdmin {
        MilestonePayment storage payment = milestonePayments[_kontrakId][_terminKe];
        require(payment.kontrakId != 0, "Milestone invoice not found");

        payment.noSpb = _noSpb;
        payment.status = MilestoneStatus.Paid;
        payment.paidAt = block.timestamp;

        emit PaymentApproved(_kontrakId, _terminKe, _noSpb, block.timestamp);
    }

    // ==========================================
    // GETTERS & AUDIT UTILITIES
    // ==========================================
    function getTender(uint256 _tenderId) external view returns (Tender memory) {
        return tenders[_tenderId];
    }

    function getBid(uint256 _tenderId, uint256 _vendorId) external view returns (Bid memory) {
        return bids[_tenderId][_vendorId];
    }

    function getTenderParticipants(uint256 _tenderId) external view returns (uint256[] memory) {
        return tenderVendorParticipants[_tenderId];
    }

    function verifyDocumentHash(bytes32 _documentHash) external view returns (bool) {
        return isDocumentHashVerified[_documentHash];
    }

    function totalSignaturesCount() external view returns (uint256) {
        return signatureRecords.length;
    }
}
