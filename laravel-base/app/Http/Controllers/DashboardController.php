<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\Lelang;
use App\Models\LelangPeserta;
use App\Models\PaketPengadaan;
use App\Models\Rup;
use App\Models\KontrakPekerjaan;
use App\Models\DaftarHitam;
use App\Models\Sanggahan;
use App\Models\Penagihan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getAdminStats()
    {
        $totalPagu = Rup::sum('nilai_pagu');
        if ($totalPagu == 0) {
            $totalPagu = PaketPengadaan::sum('nilai_pagu');
        }

        return response()->json([
            'total_vendor' => Vendor::count(),
            'total_lelang' => Lelang::count(),
            'total_tender' => PaketPengadaan::where('jenis_paket', 'tender')->count(),
            'total_non_tender' => PaketPengadaan::where('jenis_paket', 'non tender')->count(),
            'total_rup' => Rup::count(),
            'total_kontrak' => KontrakPekerjaan::count(),
            'total_daftar_hitam' => DaftarHitam::where('status', 'Aktif')->count(),
            'total_sanggahan' => Sanggahan::count(),
            'total_penagihan' => Penagihan::count(),
            'total_pagu' => (float) $totalPagu,
            'recent_lelang' => Lelang::with(['paket'])->latest('id')->take(5)->get(),
            'recent_activities' => ActivityLog::with('user')->latest('id')->take(6)->get(),
        ]);
    }

    public function getVendorStats(Request $request)
    {
        $vendorId = $request->query('vendor_id');
        $user = $request->user();

        if (!$vendorId && $user && $user->vendor) {
            $vendorId = $user->vendor->id;
        }

        $lelangDiikuti = $vendorId ? LelangPeserta::where('vendor_id', $vendorId)->count() : 0;
        $lelangMenang = $vendorId ? LelangPeserta::where('vendor_id', $vendorId)->where('status_peserta', 'Pemenang')->count() : 0;
        $kontrakAktif = $vendorId ? KontrakPekerjaan::where('vendor_id', $vendorId)->where('status_pekerjaan', 'progress')->count() : 0;
        $sanggahanDiajukan = $vendorId ? Sanggahan::where('vendor_id', $vendorId)->count() : 0;
        $penagihanPending = $vendorId ? Penagihan::where('vendor_id', $vendorId)->whereIn('status', ['baru', 'dikirim'])->count() : 0;

        return response()->json([
            'lelang_aktif' => Lelang::whereIn('status', ['Aktif', 'Draft', 'Evaluasi'])->count(),
            'lelang_diikuti' => $lelangDiikuti,
            'lelang_menang' => $lelangMenang,
            'kontrak_aktif' => $kontrakAktif,
            'sanggahan_diajukan' => $sanggahanDiajukan,
            'penagihan_pending' => $penagihanPending,
            'recent_lelang' => Lelang::with(['paket'])->whereIn('status', ['Aktif', 'Draft'])->latest('id')->take(5)->get(),
        ]);
    }
}
