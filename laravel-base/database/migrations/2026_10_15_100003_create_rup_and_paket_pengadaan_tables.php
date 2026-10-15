<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('rup')) {
            Schema::create('rup', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('satker_id')->nullable();
                $table->string('kode_rup', 50)->nullable();
                $table->string('nama_kegiatan', 255);
                $table->integer('tahun_anggaran');
                $table->string('sumber_dana', 50)->nullable();
                $table->decimal('nilai_pagu', 18, 2)->default(0);
                $table->enum('tipe_pengadaan', ['Penyedia', 'Swakelola'])->default('Penyedia');
                $table->boolean('is_pdn')->default(true);
                $table->boolean('is_umkk')->default(true);
                $table->timestamp('created_at')->nullable();

                $table->foreign('satker_id')->references('id')->on('satker')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('paket_pengadaan')) {
            Schema::create('paket_pengadaan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('rup_id')->nullable();
                $table->unsignedBigInteger('satker_id')->nullable();
                $table->string('kode_paket', 50)->unique();
                $table->string('nama_paket', 255);
                $table->enum('jenis_paket', ['tender', 'non tender'])->default('tender');
                $table->string('jenis_pengadaan', 100);
                $table->string('metode_pengadaan', 100);
                $table->string('jenis_kontrak', 100)->nullable();
                $table->decimal('nilai_pagu', 18, 2)->default(0);
                $table->decimal('nilai_hps', 18, 2)->default(0);
                $table->integer('tahun_anggaran');
                $table->string('lokasi_pekerjaan', 200)->nullable();
                $table->string('tahap', 100)->nullable();
                $table->text('syarat_kualifikasi')->nullable();
                $table->integer('bobot_teknis')->nullable()->default(70);
                $table->integer('bobot_harga')->nullable()->default(30);
                $table->timestamps();

                $table->foreign('rup_id')->references('id')->on('rup')->onDelete('set null');
                $table->foreign('satker_id')->references('id')->on('satker')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('paket_pengadaan');
        Schema::dropIfExists('rup');
    }
};
