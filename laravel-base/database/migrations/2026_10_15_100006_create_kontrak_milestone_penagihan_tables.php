<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('kontrak_pekerjaan')) {
            Schema::create('kontrak_pekerjaan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('paket_id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('nomor_kontrak', 100);
                $table->date('tanggal_kontrak')->nullable();
                $table->date('tanggal_mulai')->nullable();
                $table->date('tanggal_selesai')->nullable();
                $table->decimal('nilai_kontrak', 18, 2)->default(0);
                $table->integer('progres_persen')->default(0);
                $table->enum('status_pekerjaan', ['progress', 'done', 'delayed'])->default('progress');
                $table->string('file_kontrak', 255)->nullable();
                $table->timestamps();

                $table->foreign('paket_id')->references('id')->on('paket_pengadaan')->onDelete('cascade');
                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('pekerjaan_milestone')) {
            Schema::create('pekerjaan_milestone', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('kontrak_id');
                $table->string('judul_milestone', 150);
                $table->integer('urutan')->default(1);
                $table->decimal('target_persen', 5, 2)->default(0);
                $table->decimal('realisasi_persen', 5, 2)->default(0);
                $table->date('target_selesai')->nullable();
                $table->date('realisasi_selesai')->nullable();
                $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
                $table->string('file_dokumentasi', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('kontrak_id')->references('id')->on('kontrak_pekerjaan')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('penagihan')) {
            Schema::create('penagihan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('kontrak_id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('no_penagihan', 100);
                $table->integer('termin_ke')->default(1);
                $table->decimal('jumlah_tagihan', 18, 2)->default(0);
                $table->date('tanggal_penagihan')->nullable();
                $table->date('deadline_pembayaran')->nullable();
                $table->text('keterangan')->nullable();
                $table->string('file_dokumen_tagihan', 255)->nullable();
                $table->enum('status', ['baru', 'dikirim', 'dibayar', 'overdue', 'tertunda'])->default('baru');
                $table->timestamp('tanggal_dibayar')->nullable();
                $table->string('file_bukti_bayar', 255)->nullable();
                $table->timestamps();

                $table->foreign('kontrak_id')->references('id')->on('kontrak_pekerjaan')->onDelete('cascade');
                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('penagihan');
        Schema::dropIfExists('pekerjaan_milestone');
        Schema::dropIfExists('kontrak_pekerjaan');
    }
};
