<?php

namespace App\Http\Controllers;

use App\Models\Sanggahan;
use Illuminate\Http\Request;

class SanggahanController extends Controller
{
    public function index(Request $request)
    {
        $query = Sanggahan::with(['lelang.paket', 'vendor'])->latest('id');

        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->filled('lelang_id')) {
            $query->where('lelang_id', $request->lelang_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('no_surat', 'like', "%$s%")
                  ->orWhere('alasan_sanggah', 'like', "%$s%")
                  ->orWhereHas('vendor', function($vq) use ($s) {
                      $vq->where('nama_perusahaan', 'like', "%$s%");
                  });
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lelang_id' => 'required|exists:lelang,id',
            'vendor_id' => 'required|exists:vendors,id',
            'no_surat' => 'required|string|max:100',
            'tanggal_sanggah' => 'required|date',
            'alasan_sanggah' => 'required|string',
            'file_dokumentasi' => 'nullable|string|max:255',
            'status' => 'nullable|in:baru,sedang_ditinjau,diterima,ditolak',
        ]);

        $item = Sanggahan::create($validated);
        return response()->json($item->load(['lelang.paket', 'vendor']), 201);
    }

    public function show($id)
    {
        $item = Sanggahan::with(['lelang.paket', 'vendor'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Sanggahan::findOrFail($id);
        $data = $request->all();

        // Jika admin memberikan jawaban sanggah
        if (!empty($data['jawaban_sanggah']) && empty($item->tanggal_jawaban)) {
            $data['tanggal_jawaban'] = now();
        }

        $item->update($data);
        return response()->json($item->load(['lelang.paket', 'vendor']));
    }

    public function destroy($id)
    {
        Sanggahan::destroy($id);
        return response()->json(['message' => 'Sanggahan berhasil dihapus']);
    }
}
