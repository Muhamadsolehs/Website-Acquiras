/**
 * ABI Smart Contract AcquirasProcurement
 * Alamat: 0xd9145CCE52D386f254917e481eB44e9943F39138
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
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "kodePaket", type: "string" },
      { internalType: "string", name: "namaPaket", type: "string" },
      { internalType: "uint256", name: "nilaiHps", type: "uint256" },
      { internalType: "string", name: "ipfsKakCid", type: "string" },
      { internalType: "bytes32", name: "dataHash", type: "bytes32" },
      { internalType: "uint256", name: "tanggalMulai", type: "uint256" },
      { internalType: "uint256", name: "tanggalSelesai", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint256", name: "winnerVendorId", type: "uint256" }
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
  }
];
