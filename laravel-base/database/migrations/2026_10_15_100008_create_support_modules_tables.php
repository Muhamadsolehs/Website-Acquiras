<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('ahli')) {
            Schema::create('ahli', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('nama_ahli', 150);
                $table->string('email_ahli', 150)->nullable();
                $table->string('no_telepon', 50)->nullable();
                $table->string('jabatan', 100)->nullable();
                $table->string('provinsi', 100)->nullable();
                $table->boolean('status_aktif')->default(true);
                $table->timestamp('last_login')->nullable();
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('pemohon')) {
            Schema::create('pemohon', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('nama_pemohon', 150);
                $table->string('email_pemohon', 150)->nullable();
                $table->string('no_telepon', 50)->nullable();
                $table->string('instansi', 150)->nullable();
                $table->string('satker', 150)->nullable();
                $table->boolean('status_aktif')->default(true);
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('permohonan')) {
            Schema::create('permohonan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('no_tiket', 50)->unique();
                $table->unsignedBigInteger('pemohon_id')->nullable();
                $table->unsignedBigInteger('ahli_id')->nullable();
                $table->string('judul_permohonan', 255);
                $table->text('deskripsi_permohonan')->nullable();
                $table->string('file_dokumen_pendukung', 255)->nullable();
                $table->enum('status', ['pending', 'proses', 'selesai', 'ditolak'])->default('pending');
                $table->timestamp('created_at')->nullable();

                $table->foreign('pemohon_id')->references('id')->on('pemohon')->onDelete('set null');
                $table->foreign('ahli_id')->references('id')->on('ahli')->onDelete('set null');
            });
        }

        if (!Schema::hasTable('kriteria_penilaian')) {
            Schema::create('kriteria_penilaian', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('nama_kriteria', 255);
                $table->string('kategori', 100)->nullable();
                $table->boolean('status_aktif')->default(true);
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->integer('id')->autoIncrement();
                $table->string('setting_key', 100)->unique();
                $table->text('setting_value')->nullable();
                $table->string('setting_group', 50)->nullable();
                $table->timestamp('updated_at')->nullable();
            });
        }

        if (!Schema::hasTable('activity_logs')) {
            Schema::create('activity_logs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('activity', 200);
                $table->text('activity_details')->nullable();
                $table->string('status_badge', 50)->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('kriteria_penilaian');
        Schema::dropIfExists('permohonan');
        Schema::dropIfExists('pemohon');
        Schema::dropIfExists('ahli');
    }
};
