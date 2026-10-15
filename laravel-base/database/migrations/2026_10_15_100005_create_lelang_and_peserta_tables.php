<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lelang')) {
            Schema::create('lelang', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('paket_id');
                $table->string('no_lelang', 50);
                $table->string('judul_lelang', 255);
                $table->longText('deskripsi_lelang')->nullable();
                $table->date('tanggal_mulai');
                $table->time('jam_mulai');
                $table->date('tanggal_selesai');
                $table->time('jam_selesai');
                $table->string('file_dokumen_lelang', 255)->nullable();
                $table->enum('status', ['Draft', 'Aktif', 'Evaluasi', 'Masa Sanggah', 'Selesai', 'Batal'])->default('Draft');
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->foreign('paket_id')->references('id')->on('paket_pengadaan')->onDelete('cascade');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('lelang_peserta')) {
            Schema::create('lelang_peserta', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('lelang_id');
                $table->unsignedBigInteger('vendor_id');
                $table->timestamp('tanggal_daftar')->useCurrent();
                $table->decimal('nilai_penawaran', 18, 2)->nullable();
                $table->decimal('skor_teknis', 5, 2)->nullable();
                $table->decimal('skor_harga', 5, 2)->nullable();
                $table->decimal('total_skor', 5, 2)->nullable();
                $table->string('file_dokumen_penawaran', 255)->nullable();
                $table->enum('status_peserta', ['Terdaftar', 'Memasukkan Penawaran', 'Lolos Evaluasi', 'Gugur', 'Pemenang'])->default('Terdaftar');
                $table->timestamp('created_at')->nullable();

                $table->foreign('lelang_id')->references('id')->on('lelang')->onDelete('cascade');
                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lelang_peserta');
        Schema::dropIfExists('lelang');
    }
};
