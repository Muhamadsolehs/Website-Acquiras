/**
 * ABI Smart Contract AcquirasProcurement
 * Alamat: 0xBC62Eee229A4c1653dFb0Ed0A82d07825976dE76 (Sepolia Testnet)
 */
export const ACQUIRAS_CONTRACT_ABI = [
  // 1. publishTender
  {
    inputs: [
      { internalType: "uint256", name: "_tenderId", type: "uint256" },
      { internalType: "string", name: "_kodePaket", type: "string" },
      { internalType: "string", name: "_namaPaket", type: "string" },
      { internalType: "uint256", name: "_nilaiHps", type: "uint256" },
      { internalType: "string", name: "_ipfsKakCid", type: "string" },
      { internalType: "bytes32", name: "_dataHash", type: "bytes32" },
      { internalType: "uint256", name: "_tanggalMulai", type: "uint256" },
      { internalType: "uint256", name: "_tanggalSelesai", type: "uint256" }
    ],
    name: "publishTender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 2. submitBid
  {
    inputs: [
      { internalType: "uint256", name: "_tenderId", type: "uint256" },
      { internalType: "uint256", name: "_vendorId", type: "uint256" },
      { internalType: "uint256", name: "_penawaranHarga", type: "uint256" },
      { internalType: "string", name: "_ipfsDokumenPenawaran", type: "string" },
      { internalType: "bytes32", name: "_penawaranHash", type: "bytes32" }
    ],
    name: "submitBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 3. awardWinner
  {
    inputs: [
      { internalType: "uint256", name: "_tenderId", type: "uint256" },
      { internalType: "uint256", name: "_winnerVendorId", type: "uint256" },
      { internalType: "uint256", name: "_finalPrice", type: "uint256" },
      { internalType: "string", name: "_ipfsBeritaAcara", type: "string" }
    ],
    name: "awardWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 4. recordSignature
  {
    inputs: [
      { internalType: "uint256", name: "_refId", type: "uint256" },
      { internalType: "string", name: "_docType", type: "string" },
      { internalType: "bytes32", name: "_documentHash", type: "bytes32" },
      { internalType: "string", name: "_signerName", type: "string" },
      { internalType: "string", name: "_bsreCertId", type: "string" }
    ],
    name: "recordSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 5. recordMilestone
  {
    inputs: [
      { internalType: "uint256", name: "_kontrakId", type: "uint256" },
      { internalType: "uint8", name: "_terminKe", type: "uint8" },
      { internalType: "string", name: "_noPenagihan", type: "string" },
      { internalType: "uint256", name: "_jumlahTagihan", type: "uint256" },
      { internalType: "string", name: "_ipfsBapCid", type: "string" }
    ],
    name: "recordMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 6. approveMilestonePayment
  {
    inputs: [
      { internalType: "uint256", name: "_kontrakId", type: "uint256" },
      { internalType: "uint8", name: "_terminKe", type: "uint8" },
      { internalType: "string", name: "_noSpb", type: "string" }
    ],
    name: "approveMilestonePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // 7. getTender
  {
    inputs: [{ internalType: "uint256", name: "_tenderId", type: "uint256" }],
    name: "getTender",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "kodePaket", type: "string" },
          { internalType: "string", name: "namaPaket", type: "string" },
          { internalType: "uint256", name: "nilaiHps", type: "uint256" },
          { internalType: "string", name: "ipfsKakCid", type: "string" },
          { internalType: "bytes32", name: "dataHash", type: "bytes32" },
          { internalType: "uint256", name: "tanggalMulai", type: "uint256" },
          { internalType: "uint256", name: "tanggalSelesai", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "winnerVendorId", type: "uint256" },
          { internalType: "address", name: "registeredBy", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" }
        ],
        internalType: "struct AcquirasProcurement.Tender",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // 8. verifyDocumentHash
  {
    inputs: [{ internalType: "bytes32", name: "_documentHash", type: "bytes32" }],
    name: "verifyDocumentHash",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  // 9. getBid
  {
    inputs: [
      { internalType: "uint256", name: "_tenderId", type: "uint256" },
      { internalType: "uint256", name: "_vendorId", type: "uint256" }
    ],
    name: "getBid",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tenderId", type: "uint256" },
          { internalType: "uint256", name: "vendorId", type: "uint256" },
          { internalType: "address", name: "vendorWallet", type: "address" },
          { internalType: "uint256", name: "penawaranHarga", type: "uint256" },
          { internalType: "string", name: "ipfsDokumenPenawaran", type: "string" },
          { internalType: "bytes32", name: "penawaranHash", type: "bytes32" },
          { internalType: "uint256", name: "submittedAt", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" }
        ],
        internalType: "struct AcquirasProcurement.Bid",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // 10. getTenderParticipants
  {
    inputs: [{ internalType: "uint256", name: "_tenderId", type: "uint256" }],
    name: "getTenderParticipants",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  // 11. totalSignaturesCount
  {
    inputs: [],
    name: "totalSignaturesCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  // 12. signatureRecords
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "signatureRecords",
    outputs: [
      { internalType: "uint256", name: "refId", type: "uint256" },
      { internalType: "string", name: "docType", type: "string" },
      { internalType: "bytes32", name: "documentHash", type: "bytes32" },
      { internalType: "string", name: "signerName", type: "string" },
      { internalType: "address", name: "signerWallet", type: "address" },
      { internalType: "string", name: "bsreCertId", type: "string" },
      { internalType: "uint256", name: "signedAt", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  // 13. milestonePayments
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint8", name: "", type: "uint8" }
    ],
    name: "milestonePayments",
    outputs: [
      { internalType: "uint256", name: "kontrakId", type: "uint256" },
      { internalType: "uint8", name: "terminKe", "type": "uint8" },
      { internalType: "string", name: "noPenagihan", "type": "string" },
      { internalType: "uint256", name: "jumlahTagihan", "type": "uint256" },
      { internalType: "string", name: "ipfsBapCid", "type": "string" },
      { internalType: "string", name: "noSpb", "type": "string" },
      { internalType: "uint8", name: "status", "type": "uint8" },
      { internalType: "uint256", name: "paidAt", "type": "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
];
