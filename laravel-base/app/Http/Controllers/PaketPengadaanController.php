<?php
namespace App\Http\Controllers;
use App\Models\PaketPengadaan;
use Illuminate\Http\Request;

use Illuminate\Support\Str;

class PaketPengadaanController extends Controller
{
    public function index()
    {
        return response()->json(PaketPengadaan::with(['rup', 'satker'])->latest('id')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_paket' => 'required|string|max:255',
            'kode_paket' => 'nullable|string|max:50|unique:paket_pengadaan,kode_paket',
            'jenis_paket' => 'nullable|in:tender,non tender',
            'jenis_pengadaan' => 'nullable|string|max:100',
            'metode_pengadaan' => 'nullable|string|max:100',
            'jenis_kontrak' => 'nullable|string|max:100',
            'nilai_pagu' => 'required|numeric|min:0',
            'nilai_hps' => 'nullable|numeric|min:0',
            'tahun_anggaran' => 'nullable|integer',
            'lokasi_pekerjaan' => 'nullable|string|max:200',
            'syarat_kualifikasi' => 'nullable|string',
            'bobot_teknis' => 'nullable|integer|between:0,100',
            'bobot_harga' => 'nullable|integer|between:0,100',
            'satker_id' => 'nullable|exists:satker,id',
            'rup_id' => 'nullable|exists:rup,id',
        ]);

        if (empty($validated['kode_paket'])) {
            $prefix = ($validated['jenis_paket'] ?? 'tender') === 'non tender' ? 'PKT-NT-' : 'PKT-';
            $validated['kode_paket'] = $prefix . date('y') . '-' . strtoupper(Str::random(4));
        }

        if (empty($validated['jenis_paket'])) {
            $validated['jenis_paket'] = 'tender';
        }

        if (empty($validated['jenis_pengadaan'])) {
            $validated['jenis_pengadaan'] = 'Pengadaan Barang & Jasa';
        }

        if (empty($validated['metode_pengadaan'])) {
            $validated['metode_pengadaan'] = $validated['jenis_paket'] === 'non tender' ? 'Pengadaan Langsung' : 'Tender Umum';
        }

        if (empty($validated['nilai_hps'])) {
            $validated['nilai_hps'] = $validated['nilai_pagu'];
        }

        if (empty($validated['tahun_anggaran'])) {
            $validated['tahun_anggaran'] = (int) date('Y');
        }

        if (empty($validated['tahap'])) {
            $validated['tahap'] = 'Pengadaan';
        }

        $item = PaketPengadaan::create($validated);
        return response()->json($item, 201);
    }
    public function show($id)
    {
        return response()->json(PaketPengadaan::with(['lelang', 'kontrak'])->findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = PaketPengadaan::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        PaketPengadaan::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
