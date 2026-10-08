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
            'status_peserta' => 'nullable|in:Terdaftar,Memasukkan Penawaran,Lolos Evaluasi,Gugur,Pemenang',
        ]);

        // Cek jika sudah terdaftar
        $existing = LelangPeserta::where('lelang_id', $validated['lelang_id'])
            ->where('vendor_id', $validated['vendor_id'])
            ->first();

        if ($existing) {
            $existing->update($validated);
            return response()->json($existing->load(['lelang.paket', 'vendor']));
        }

        $item = LelangPeserta::create($validated);
        return response()->json($item->load(['lelang.paket', 'vendor']), 201);
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
