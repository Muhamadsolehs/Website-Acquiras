<?php

namespace App\Http\Controllers;

use App\Models\Ahli;
use Illuminate\Http\Request;

class AhliController extends Controller
{
    public function index(Request $request)
    {
        $query = Ahli::latest('id');

        if ($request->filled('status_aktif')) {
            $query->where('status_aktif', $request->status_aktif);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('nama_ahli', 'like', "%$s%")
                  ->orWhere('email_ahli', 'like', "%$s%")
                  ->orWhere('jabatan', 'like', "%$s%")
                  ->orWhere('provinsi', 'like', "%$s%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ahli' => 'required|string|max:150',
            'email_ahli' => 'required|email|max:150|unique:ahli,email_ahli',
            'no_telepon' => 'required|string|max:50',
            'jabatan' => 'required|string|max:100',
            'provinsi' => 'required|string|max:100',
            'status_aktif' => 'nullable|boolean',
        ]);

        $item = Ahli::create($validated);
        return response()->json($item, 201);
    }

    public function show($id)
    {
        return response()->json(Ahli::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = Ahli::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        Ahli::destroy($id);
        return response()->json(['message' => 'Data ahli pengadaan berhasil dihapus']);
    }
}
