<?php

namespace App\Http\Controllers;

use App\Models\DaftarHitam;
use Illuminate\Http\Request;

class DaftarHitamController extends Controller
{
    public function index(Request $request)
    {
        $query = DaftarHitam::with(['vendor', 'paket'])->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('nomor_sk', 'like', "%$s%")
                  ->orWhere('alasan', 'like', "%$s%")
                  ->orWhereHas('vendor', function($vq) use ($s) {
                      $vq->where('nama_perusahaan', 'like', "%$s%")
                         ->orWhere('npwp', 'like', "%$s%");
                  });
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'paket_id' => 'nullable|exists:paket_pengadaan,id',
            'nomor_sk' => 'required|string|max:100',
            'skenario' => 'nullable|string|max:50',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'durasi_sanksi' => 'nullable|string|max:50',
            'alasan' => 'required|string',
            'status' => 'nullable|in:Aktif,Berakhir,Dicabut',
            'file_sk' => 'nullable|string|max:255',
        ]);

        $item = DaftarHitam::create($validated);
        return response()->json($item->load(['vendor', 'paket']), 201);
    }

    public function show($id)
    {
        $item = DaftarHitam::with(['vendor', 'paket'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = DaftarHitam::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load(['vendor', 'paket']));
    }

    public function destroy($id)
    {
        DaftarHitam::destroy($id);
        return response()->json(['message' => 'Data daftar hitam berhasil dihapus']);
    }
}
