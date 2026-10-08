<?php

namespace App\Http\Controllers;

use App\Models\Pemohon;
use Illuminate\Http\Request;

class PemohonController extends Controller
{
    public function index(Request $request)
    {
        $query = Pemohon::latest('id');

        if ($request->filled('status_aktif')) {
            $query->where('status_aktif', $request->status_aktif);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('nama_pemohon', 'like', "%$s%")
                  ->orWhere('email_pemohon', 'like', "%$s%")
                  ->orWhere('instansi', 'like', "%$s%")
                  ->orWhere('satker', 'like', "%$s%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pemohon' => 'required|string|max:150',
            'email_pemohon' => 'required|email|max:150|unique:pemohon,email_pemohon',
            'no_telepon' => 'required|string|max:50',
            'instansi' => 'required|string|max:150',
            'satker' => 'required|string|max:150',
            'status_aktif' => 'nullable|boolean',
        ]);

        $item = Pemohon::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return response()->json(Pemohon::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = Pemohon::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        Pemohon::destroy($id);
        return response()->json(['message' => 'Data pemohon berhasil dihapus']);
    }
}
