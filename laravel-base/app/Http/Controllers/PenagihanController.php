<?php

namespace App\Http\Controllers;

use App\Models\Penagihan;
use Illuminate\Http\Request;

class PenagihanController extends Controller
{
    public function index(Request $request)
    {
        $query = Penagihan::with(['kontrak.paket', 'vendor'])->latest('id');

        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->filled('kontrak_id')) {
            $query->where('kontrak_id', $request->kontrak_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('no_penagihan', 'like', "%$s%")
                  ->orWhere('keterangan', 'like', "%$s%")
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
            'kontrak_id' => 'required|exists:kontrak_pekerjaan,id',
            'vendor_id' => 'required|exists:vendors,id',
            'no_penagihan' => 'required|string|max:100|unique:penagihan,no_penagihan',
            'termin_ke' => 'nullable|integer|min:1',
            'jumlah_tagihan' => 'required|numeric|min:0',
            'tanggal_penagihan' => 'required|date',
            'deadline_pembayaran' => 'required|date|after_or_equal:tanggal_penagihan',
            'keterangan' => 'nullable|string',
            'file_dokumen_tagihan' => 'nullable|string|max:255',
            'status' => 'nullable|in:baru,dikirim,dibayar,overdue,tertunda',
        ]);

        $item = Penagihan::create($validated);
        return response()->json($item->load(['kontrak.paket', 'vendor']), 201);
    }

    public function show($id)
    {
        $item = Penagihan::with(['kontrak.paket', 'vendor'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = Penagihan::findOrFail($id);
        
        $data = $request->all();
        if (isset($data['status']) && $data['status'] === 'dibayar' && empty($item->tanggal_dibayar)) {
            $data['tanggal_dibayar'] = now();
        }

        $item->update($data);
        return response()->json($item->load(['kontrak.paket', 'vendor']));
    }

    public function destroy($id)
    {
        Penagihan::destroy($id);
        return response()->json(['message' => 'Data penagihan berhasil dihapus']);
    }
}
