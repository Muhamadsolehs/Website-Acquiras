<?php

namespace App\Http\Controllers;

use App\Models\KriteriaPenilaian;
use Illuminate\Http\Request;

class KriteriaPenilaianController extends Controller
{
    public function index(Request $request)
    {
        $query = KriteriaPenilaian::latest('id');

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('status_aktif')) {
            $query->where('status_aktif', $request->status_aktif);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kriteria' => 'required|string|max:255',
            'kategori' => 'nullable|string|max:100',
            'status_aktif' => 'nullable|boolean',
        ]);

        $item = KriteriaPenilaian::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return response()->json(KriteriaPenilaian::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = KriteriaPenilaian::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        KriteriaPenilaian::destroy($id);
        return response()->json(['message' => 'Kriteria penilaian berhasil dihapus']);
    }
}
