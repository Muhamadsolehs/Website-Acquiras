<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kontrak_pekerjaan', function (Blueprint $table) {
            if (!Schema::hasColumn('kontrak_pekerjaan', 'no_surat_jalan')) {
                $table->string('no_surat_jalan', 100)->nullable()->after('nomor_kontrak');
            }
            if (!Schema::hasColumn('kontrak_pekerjaan', 'tanggal_surat_jalan')) {
                $table->date('tanggal_surat_jalan')->nullable()->after('no_surat_jalan');
            }
            // Allow flexible status string
            $table->string('status_pekerjaan', 50)->default('Persiapan')->change();
        });
    }

    public function down(): void
    {
        Schema::table('kontrak_pekerjaan', function (Blueprint $table) {
            if (Schema::hasColumn('kontrak_pekerjaan', 'no_surat_jalan')) {
                $table->dropColumn('no_surat_jalan');
            }
            if (Schema::hasColumn('kontrak_pekerjaan', 'tanggal_surat_jalan')) {
                $table->dropColumn('tanggal_surat_jalan');
            }
        });
    }
};
