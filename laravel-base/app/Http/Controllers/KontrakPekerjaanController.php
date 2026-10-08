<?php

namespace App\Http\Controllers;

use App\Models\KontrakPekerjaan;
use Illuminate\Http\Request;

class KontrakPekerjaanController extends Controller
{
    public function index(Request $request)
    {
        $query = KontrakPekerjaan::with(['paket.satker', 'vendor', 'milestone', 'penagihan'])->latest('id');

        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->filled('status')) {
            $query->where('status_pekerjaan', $request->status);
        }

        if ($request->filled('year')) {
            $query->whereYear('tanggal_mulai', $request->year);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('nomor_kontrak', 'like', "%$s%")
                  ->orWhereHas('paket', function($pq) use ($s) {
                      $pq->where('nama_paket', 'like', "%$s%")
                         ->orWhere('kode_paket', 'like', "%$s%");
                  })
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
            'paket_id' => 'required|exists:paket_pengadaan,id',
            'vendor_id' => 'required|exists:vendors,id',
            'nomor_kontrak' => 'required|string|max:100|unique:kontrak_pekerjaan,nomor_kontrak',
            'tanggal_kontrak' => 'required|date',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'nilai_kontrak' => 'required|numeric|min:0',
            'progres_persen' => 'nullable|integer|between:0,100',
            'status_pekerjaan' => 'nullable|in:progress,done,delayed',
            'file_kontrak' => 'nullable|string|max:255',
        ]);

        $item = KontrakPekerjaan::create($validated);
        return response()->json($item->load(['paket', 'vendor', 'milestone']), 201);
    }

    public function show($id)
    {
        $item = KontrakPekerjaan::with(['paket.satker', 'vendor', 'milestone', 'penagihan'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = KontrakPekerjaan::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load(['paket', 'vendor', 'milestone', 'penagihan']));
    }

    public function destroy($id)
    {
        KontrakPekerjaan::destroy($id);
        return response()->json(['message' => 'Kontrak pekerjaan berhasil dihapus']);
    }
}
