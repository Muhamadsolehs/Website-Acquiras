<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vendor;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Login user & generate Sanctum token
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = $request->input('username');
        $password = $request->input('password');

        // Cari berdasarkan username atau email
        $user = User::with(['role', 'vendor'])
            ->where('username', $loginInput)
            ->orWhere('email', $loginInput)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Username atau password salah',
                'errors' => [
                    ['field' => 'username', 'message' => 'Akun tidak ditemukan']
                ]
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi administrator.',
            ], 403);
        }

        // Verifikasi password
        if (!Hash::check($password, $user->password_hash)) {
            return response()->json([
                'message' => 'Username atau password salah',
                'errors' => [
                    ['field' => 'password', 'message' => 'Password salah']
                ]
            ], 401);
        }

        // Update last login
        $user->update(['last_login' => now()]);

        // Catat activity log jika tabel activity_logs ada
        try {
            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'LOGIN',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent() ?? 'Web',
                'details' => 'User ' . $user->username . ' berhasil login.',
            ]);
        } catch (\Exception $e) {
            // Ignore log error
        }

        // Generate token
        $token = $user->createToken('eproc_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => (string) $user->role_id,
                'role_name' => $user->role ? $user->role->name : ($user->role_id == 1 ? 'Admin' : 'Vendor'),
                'vendor' => $user->vendor,
            ]
        ]);
    }

    /**
     * Register akun vendor baru
     */
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:100|unique:users,username',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:6',
            'nama_perusahaan' => 'required|string|max:200',
            'bentuk_usaha' => 'nullable|string|max:100',
            'npwp' => 'required|string|max:30',
            'no_telepon' => 'required|string|max:50',
            'alamat' => 'required|string',
            'provinsi' => 'nullable|string|max:100',
            'kabupaten_kota' => 'nullable|string|max:100',
        ]);

        try {
            // 1. Buat User
            $user = User::create([
                'role_id' => 2, // Vendor role
                'username' => $request->username,
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
                'first_name' => $request->first_name ?? $request->nama_perusahaan,
                'last_name' => $request->last_name ?? '',
                'is_active' => 1,
            ]);

            // 2. Buat Record Vendor
            $vendorCode = 'VND-' . strtoupper(Str::random(6));
            $vendor = Vendor::create([
                'user_id' => $user->id,
                'id_vendor_code' => $vendorCode,
                'nama_perusahaan' => $request->nama_perusahaan,
                'bentuk_usaha' => $request->bentuk_usaha ?? 'PT',
                'status_cabang' => $request->status_cabang ? 1 : 0,
                'npwp' => $request->npwp,
                'kswp_valid' => 1,
                'kualifikasi' => $request->kualifikasi ?? 'Kecil',
                'alamat' => $request->alamat,
                'provinsi' => $request->provinsi ?? 'DKI Jakarta',
                'kabupaten_kota' => $request->kabupaten_kota ?? 'Jakarta Pusat',
                'no_telepon' => $request->no_telepon,
                'email_perusahaan' => $request->email,
            ]);

            // 3. Activity Log
            try {
                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => 'REGISTER_VENDOR',
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent() ?? 'Web',
                    'details' => 'Vendor baru terdaftar: ' . $vendor->nama_perusahaan,
                ]);
            } catch (\Exception $e) {}

            $token = $user->createToken('eproc_auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Pendaftaran akun vendor berhasil',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'role' => (string) $user->role_id,
                    'role_name' => 'Vendor',
                    'vendor' => $vendor,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal melakukan pendaftaran: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Dapatkan data user yang sedang login
     */
    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user->load(['role', 'vendor']);

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'role' => (string) $user->role_id,
            'role_name' => $user->role ? $user->role->name : ($user->role_id == 1 ? 'Admin' : 'Vendor'),
            'vendor' => $user->vendor,
            'photo' => $user->photo,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Berhasil logout'
        ]);
    }
}
