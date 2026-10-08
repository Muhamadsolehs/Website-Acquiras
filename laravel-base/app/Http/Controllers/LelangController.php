<?php

namespace App\Http\Controllers;

use App\Models\Lelang;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LelangController extends Controller
{
    public function index(Request $request)
    {
        $query = Lelang::with(['paket.satker', 'createdBy', 'peserta.vendor'])->latest('id');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('jenis_paket')) {
            $jenis = $request->jenis_paket;
            $query->whereHas('paket', function($pq) use ($jenis) {
                $pq->where('jenis_paket', $jenis);
            });
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('no_lelang', 'like', "%$s%")
                  ->orWhere('judul_lelang', 'like', "%$s%")
                  ->orWhereHas('paket', function($pq) use ($s) {
                      $pq->where('nama_paket', 'like', "%$s%")
                         ->orWhere('kode_paket', 'like', "%$s%");
                  });
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paket_id' => 'required|exists:paket_pengadaan,id',
            'no_lelang' => 'nullable|string|max:50|unique:lelang,no_lelang',
            'judul_lelang' => 'required|string|max:255',
            'deskripsi_lelang' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'jam_mulai' => 'required',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'jam_selesai' => 'required',
            'file_dokumen_lelang' => 'nullable|string|max:255',
            'status' => 'nullable|in:Draft,Aktif,Evaluasi,Masa Sanggah,Selesai,Batal',
            'created_by' => 'nullable|exists:users,id',
        ]);

        if (empty($validated['no_lelang'])) {
            $validated['no_lelang'] = 'LLG-' . date('Ymd') . '-' . strtoupper(Str::random(4));
        }

        if (empty($validated['created_by'])) {
            $validated['created_by'] = $request->user() ? $request->user()->id : 1;
        }

        if (empty($validated['status'])) {
            $validated['status'] = 'Aktif';
        }

        $item = Lelang::create($validated);
        return response()->json($item->load(['paket.satker', 'createdBy']), 201);
    }

    public function show($id)
    {
        return response()->json(
            Lelang::with([
                'paket.satker',
                'createdBy',
                'peserta.vendor',
                'sanggahan.vendor'
            ])->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $item = Lelang::findOrFail($id);
        $item->update($request->all());
        return response()->json($item->load(['paket.satker', 'createdBy', 'peserta.vendor']));
    }

    public function destroy($id)
    {
        Lelang::destroy($id);
        return response()->json(['message' => 'Lelang berhasil dihapus']);
    }
}
