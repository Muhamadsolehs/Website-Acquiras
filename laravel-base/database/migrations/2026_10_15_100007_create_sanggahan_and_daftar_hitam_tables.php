<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('sanggahan')) {
            Schema::create('sanggahan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('lelang_id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('no_surat', 100);
                $table->date('tanggal_sanggah')->nullable();
                $table->text('alasan_sanggah');
                $table->string('file_dokumentasi', 255)->nullable();
                $table->enum('status', ['baru', 'sedang_ditinjau', 'diterima', 'ditolak'])->default('baru');
                $table->text('jawaban_sanggah')->nullable();
                $table->timestamp('tanggal_jawaban')->nullable();
                $table->string('file_jawaban', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('lelang_id')->references('id')->on('lelang')->onDelete('cascade');
                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('daftar_hitam')) {
            Schema::create('daftar_hitam', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->unsignedBigInteger('paket_id')->nullable();
                $table->string('nomor_sk', 100);
                $table->string('skenario', 50)->nullable();
                $table->date('tanggal_mulai')->nullable();
                $table->date('tanggal_selesai')->nullable();
                $table->string('durasi_sanksi', 50)->nullable();
                $table->text('alasan')->nullable();
                $table->enum('status', ['Aktif', 'Berakhir', 'Dicabut'])->default('Aktif');
                $table->string('file_sk', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
                $table->foreign('paket_id')->references('id')->on('paket_pengadaan')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('daftar_hitam');
        Schema::dropIfExists('sanggahan');
    }
};
