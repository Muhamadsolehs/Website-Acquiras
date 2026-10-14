<?php

namespace App\Http\Controllers;

use App\Models\LelangPeserta;
use Illuminate\Http\Request;

class LelangPesertaController extends Controller
{
    public function index(Request $request)
    {
        $query = LelangPeserta::with(['lelang.paket', 'vendor'])->latest('id');

        if ($request->filled('lelang_id')) {
            $query->where('lelang_id', $request->lelang_id);
        }

        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->filled('status_peserta')) {
            $query->where('status_peserta', $request->status_peserta);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lelang_id' => 'required|exists:lelang,id',
            'vendor_id' => 'required|exists:vendors,id',
            'nilai_penawaran' => 'nullable|numeric|min:0',
            'skor_teknis' => 'nullable|numeric|between:0,100',
            'skor_harga' => 'nullable|numeric|between:0,100',
            'total_skor' => 'nullable|numeric|between:0,100',
            'file_dokumen_penawaran' => 'nullable|string|max:255',
            'file_dokumen' => 'nullable|file|mimes:pdf,doc,docx|max:25600',
            'status_peserta' => 'nullable|in:Terdaftar,Memasukkan Penawaran,Lolos Evaluasi,Gugur,Pemenang',
        ]);

        if ($request->hasFile('file_dokumen')) {
            $uploaded = $request->file('file_dokumen');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $uploaded->getClientOriginalName());
            $uploaded->storeAs('public/dokumen_penawaran', $filename);
            $validated['file_dokumen_penawaran'] = $filename;
        }

        // Cek jika sudah terdaftar
        $existing = LelangPeserta::where('lelang_id', $validated['lelang_id'])
            ->where('vendor_id', $validated['vendor_id'])
            ->first();

        $blockchain = new \App\Services\BlockchainService();

        if ($existing) {
            $existing->update($validated);
            $proof = $blockchain->generateAuditProof('Bid Submission Sealed', $existing->id, [
                'lelang_id' => $existing->lelang_id,
                'vendor_id' => $existing->vendor_id,
                'nilai_penawaran' => $existing->nilai_penawaran,
                'file_dokumen_penawaran' => $existing->file_dokumen_penawaran,
            ]);
            $res = $existing->load(['lelang.paket', 'vendor'])->toArray();
            $res['blockchain_proof'] = $proof;
            return response()->json($res);
        }

        $item = LelangPeserta::create($validated);
        $proof = $blockchain->generateAuditProof('Bid Submission Sealed', $item->id, [
            'lelang_id' => $item->lelang_id,
            'vendor_id' => $item->vendor_id,
            'nilai_penawaran' => $item->nilai_penawaran,
            'file_dokumen_penawaran' => $item->file_dokumen_penawaran,
        ]);
        $res = $item->load(['lelang.paket', 'vendor'])->toArray();
        $res['blockchain_proof'] = $proof;
        return response()->json($res, 201);
    }

    public function show($id)
    {
        $item = LelangPeserta::with(['lelang.paket', 'vendor'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = LelangPeserta::findOrFail($id);
        
        $data = $request->all();
        // Hitung total skor jika teknis & harga ada
        if (isset($data['skor_teknis']) || isset($data['skor_harga'])) {
            $teknis = $data['skor_teknis'] ?? $item->skor_teknis ?? 0;
            $harga = $data['skor_harga'] ?? $item->skor_harga ?? 0;
            $data['total_skor'] = ($teknis * 0.7) + ($harga * 0.3);
        }

        $item->update($data);
        return response()->json($item->load(['lelang.paket', 'vendor']));
    }

    public function destroy($id)
    {
        LelangPeserta::destroy($id);
        return response()->json(['message' => 'Peserta lelang berhasil dihapus']);
    }
}
