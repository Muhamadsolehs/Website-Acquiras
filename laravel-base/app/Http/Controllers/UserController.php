<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with(['role', 'vendor'])->latest('id');

        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('username', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%")
                  ->orWhere('first_name', 'like', "%$s%")
                  ->orWhere('last_name', 'like', "%$s%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'username' => 'required|string|max:100|unique:users,username',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $validated;
        $data['password_hash'] = Hash::make($validated['password']);
        unset($data['password']);

        $user = User::create($data);

        // Jika role adalah vendor dan data perusahaan diinput, buat vendor record
        if ($user->role_id == 2 && $request->filled('nama_perusahaan')) {
            Vendor::create([
                'user_id' => $user->id,
                'id_vendor_code' => 'VND-' . strtoupper(Str::random(6)),
                'nama_perusahaan' => $request->nama_perusahaan,
                'bentuk_usaha' => $request->bentuk_usaha ?? 'PT',
                'npwp' => $request->npwp ?? '00.000.000.0-000.000',
                'alamat' => $request->alamat ?? 'Jl. Default No. 1',
                'provinsi' => $request->provinsi ?? 'DKI Jakarta',
                'kabupaten_kota' => $request->kabupaten_kota ?? 'Jakarta',
                'no_telepon' => $request->no_telepon ?? '08123456789',
                'email_perusahaan' => $user->email,
            ]);
        }

        return response()->json($user->load(['role', 'vendor']), 201);
    }

    public function show($id)
    {
        return response()->json(User::with(['role', 'vendor'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role_id' => 'nullable|exists:roles,id',
            'username' => 'nullable|string|max:100|unique:users,username,' . $id,
            'email' => 'nullable|email|max:150|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
        ]);

        $data = $request->except(['password']);
        if (!empty($request->password)) {
            $data['password_hash'] = Hash::make($request->password);
        }

        $user->update($data);
        return response()->json($user->load(['role', 'vendor']));
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'User berhasil dihapus']);
    }
}
