<?php

use Illuminate\Support\Facades\Route;

// Import semua Controller
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\InstansiController;
use App\Http\Controllers\SatkerController;
use App\Http\Controllers\RupController;
use App\Http\Controllers\PaketPengadaanController;
use App\Http\Controllers\LelangController;
use App\Http\Controllers\LelangPesertaController;
use App\Http\Controllers\SanggahanController;
use App\Http\Controllers\KontrakPekerjaanController;
use App\Http\Controllers\PekerjaanMilestoneController;
use App\Http\Controllers\PenagihanController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\VendorAktaController;
use App\Http\Controllers\VendorIzinUsahaController;
use App\Http\Controllers\VendorPemilikSahamController;
use App\Http\Controllers\VendorPengalamanController;
use App\Http\Controllers\VendorPengurusController;
use App\Http\Controllers\VendorPeralatanController;
use App\Http\Controllers\VendorTenagaAhliController;
use App\Http\Controllers\DaftarHitamController;
use App\Http\Controllers\PemohonController;
use App\Http\Controllers\AhliController;
use App\Http\Controllers\PermohonanController;
use App\Http\Controllers\KriteriaPenilaianController;
use App\Http\Controllers\DashboardController;

// 1. Rute Autentikasi
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/update', [AuthController::class, 'updateProfile']); // alias
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/auth/delete-account', [AuthController::class, 'deleteAccount']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});
// Fallback non-middleware untuk convenience jika token manual via header
Route::get('/auth/user', [AuthController::class, 'me'])->middleware('auth:sanctum');

// 2. Rute Dashboard
Route::get('/dashboard/admin-stats', [DashboardController::class, 'getAdminStats']);
Route::get('/dashboard/vendor-stats', [DashboardController::class, 'getVendorStats']);

// 3. Rute Khusus Vendor Profile
Route::get('/vendors/me/profile', [VendorController::class, 'myProfile'])->middleware('auth:sanctum');

// 4. Rute Pengguna & Pengaturan
Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);
Route::apiResource('activity-logs', ActivityLogController::class);
Route::apiResource('system-settings', SystemSettingController::class);

// 5. Rute Master Instansi & Pengadaan
Route::apiResource('instansi', InstansiController::class);
Route::apiResource('satker', SatkerController::class);
Route::apiResource('rup', RupController::class);
Route::apiResource('paket-pengadaan', PaketPengadaanController::class);

// 6. Rute Lelang & Kontrak
Route::apiResource('lelang', LelangController::class);
Route::apiResource('lelang-peserta', LelangPesertaController::class);
Route::apiResource('sanggahan', SanggahanController::class);
Route::apiResource('kontrak-pekerjaan', KontrakPekerjaanController::class);
Route::apiResource('pekerjaan-milestone', PekerjaanMilestoneController::class);
Route::apiResource('penagihan', PenagihanController::class);

// 7. Rute Vendor & Profil Vendor
Route::apiResource('vendors', VendorController::class);
Route::apiResource('vendor-akta', VendorAktaController::class);
Route::apiResource('vendor-izin-usaha', VendorIzinUsahaController::class);
Route::apiResource('vendor-pemilik-saham', VendorPemilikSahamController::class);
Route::apiResource('vendor-pengalaman', VendorPengalamanController::class);
Route::apiResource('vendor-pengurus', VendorPengurusController::class);
Route::apiResource('vendor-peralatan', VendorPeralatanController::class);
Route::apiResource('vendor-tenaga-ahli', VendorTenagaAhliController::class);
Route::apiResource('daftar-hitam', DaftarHitamController::class);

// 8. Rute Permohonan & Kriteria
Route::apiResource('pemohon', PemohonController::class);
Route::apiResource('ahli', AhliController::class);
Route::apiResource('permohonan', PermohonanController::class);
Route::apiResource('kriteria-penilaian', KriteriaPenilaianController::class);
