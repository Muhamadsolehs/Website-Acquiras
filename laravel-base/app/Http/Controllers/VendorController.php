<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = Vendor::with('user')->latest('id');

        if ($request->filled('kualifikasi')) {
            $query->where('kualifikasi', $request->kualifikasi);
        }

        if ($request->filled('bentuk_usaha')) {
            $query->where('bentuk_usaha', $request->bentuk_usaha);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('nama_perusahaan', 'like', "%$s%")
                  ->orWhere('id_vendor_code', 'like', "%$s%")
                  ->orWhere('npwp', 'like', "%$s%")
                  ->orWhere('email_perusahaan', 'like', "%$s%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nama_perusahaan' => 'required|string|max:200',
            'bentuk_usaha' => 'required|string|max:100',
            'status_cabang' => 'nullable|boolean',
            'npwp' => 'required|string|max:30',
            'tanggal_npwp' => 'nullable|date',
            'no_pkp' => 'nullable|string|max:50',
            'kswp_valid' => 'nullable|boolean',
            'kualifikasi' => 'nullable|in:Kecil,Menengah,Besar',
            'alamat' => 'required|string',
            'kode_pos' => 'nullable|string|max:10',
            'provinsi' => 'required|string|max:100',
            'kabupaten_kota' => 'required|string|max:100',
            'no_telepon' => 'required|string|max:50',
            'no_fax' => 'nullable|string|max:50',
            'website' => 'nullable|string|max:200',
            'email_perusahaan' => 'required|email|max:150',
        ]);

        if (empty($validated['id_vendor_code'])) {
            $validated['id_vendor_code'] = 'VND-' . strtoupper(Str::random(6));
        }

        $vendor = Vendor::create($validated);
        return response()->json($vendor->load('user'), 201);
    }

    public function show($id)
    {
        return response()->json(
            Vendor::with([
                'user',
                'akta',
                'izinUsaha',
                'pemilikSaham',
                'pengalaman',
                'pengurus',
                'peralatan',
                'tenagaAhli'
            ])->findOrFail($id)
        );
    }

    public function myProfile(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $vendor = Vendor::with([
            'user',
            'akta',
            'izinUsaha',
            'pemilikSaham',
            'pengalaman',
            'pengurus',
            'peralatan',
            'tenagaAhli'
        ])->where('user_id', $user->id)->first();

        if (!$vendor) {
            // Jika belum ada record vendor, return default atau create placeholder
            $vendor = Vendor::create([
                'user_id' => $user->id,
                'id_vendor_code' => 'VND-' . strtoupper(Str::random(6)),
                'nama_perusahaan' => $user->first_name ?: $user->username,
                'bentuk_usaha' => 'PT',
                'npwp' => '00.000.000.0-000.000',
                'alamat' => 'Alamat belum diatur',
                'provinsi' => 'DKI Jakarta',
                'kabupaten_kota' => 'Jakarta Pusat',
                'no_telepon' => '08123456789',
                'email_perusahaan' => $user->email,
            ]);
            $vendor->load([
                'user',
                'akta',
                'izinUsaha',
                'pemilikSaham',
                'pengalaman',
                'pengurus',
                'peralatan',
                'tenagaAhli'
            ]);
        }

        return response()->json($vendor);
    }

    public function update(Request $request, $id)
    {
        $data = Vendor::findOrFail($id);
        $data->update($request->all());
        return response()->json($data->load('user'));
    }

    public function destroy($id)
    {
        Vendor::destroy($id);
        return response()->json(['message' => 'Vendor berhasil dihapus']);
    }
}
