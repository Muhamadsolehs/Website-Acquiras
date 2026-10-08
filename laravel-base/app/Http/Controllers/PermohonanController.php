<?php

namespace App\Http\Controllers;

use App\Models\Permohonan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PermohonanController extends Controller
{
    public function index(Request $request)
    {
        $query = Permohonan::with(['pemohon', 'ahli'])->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('pemohon_id')) {
            $query->where('pemohon_id', $request->pemohon_id);
        }

        if ($request->filled('ahli_id')) {
            $query->where('ahli_id', $request->ahli_id);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('no_tiket', 'like', "%$s%")
                  ->orWhere('judul_permohonan', 'like', "%$s%")
                  ->orWhereHas('pemohon', function($pq) use ($s) {
                      $pq->where('nama_pemohon', 'like', "%$s%");
                  });
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pemohon_id' => 'required|exists:pemohon,id',
            'ahli_id' => 'nullable|exists:ahli,id',
            'judul_permohonan' => 'required|string|max:255',
            'deskripsi_permohonan' => 'nullable|string',
            'file_dokumen_pendukung' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,proses,selesai,ditolak',
        ]);

        if (empty($validated['no_tiket'])) {
            $validated['no_tiket'] = 'REQ-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        }

        $item = Permohonan::create($validated);
        return response()->json($item->load(['pemohon', 'ahli']), 201);
    }

    public function show($id)
    {
        return response()->json(Permohonan::with(['pemohon', 'ahli'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = Permohonan::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load(['pemohon', 'ahli']));
    }

    public function destroy($id)
    {
        Permohonan::destroy($id);
        return response()->json(['message' => 'Permohonan berhasil dihapus']);
    }
}
