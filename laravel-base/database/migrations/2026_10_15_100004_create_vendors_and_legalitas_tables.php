<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('vendors')) {
            Schema::create('vendors', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('user_id');
                $table->string('id_vendor_code', 50);
                $table->string('nama_perusahaan', 200);
                $table->string('bentuk_usaha', 100);
                $table->boolean('status_cabang')->default(false);
                $table->string('npwp', 30);
                $table->date('tanggal_npwp')->nullable();
                $table->string('no_pkp', 50)->nullable();
                $table->boolean('kswp_valid')->default(true);
                $table->date('tanggal_kswp')->nullable();
                $table->enum('kualifikasi', ['Kecil', 'Menengah', 'Besar'])->default('Kecil');
                $table->text('alamat');
                $table->string('kode_pos', 10)->nullable();
                $table->string('provinsi', 100);
                $table->string('kabupaten_kota', 100);
                $table->string('no_telepon', 50);
                $table->string('no_fax', 50)->nullable();
                $table->string('website', 200)->nullable();
                $table->string('email_perusahaan', 150);
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_akta')) {
            Schema::create('vendor_akta', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->enum('jenis_akta', ['Pendirian', 'Perubahan']);
                $table->string('nomor_akta', 100);
                $table->date('tanggal_akta');
                $table->string('nama_notaris', 200);
                $table->string('file_dokumen', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_izin_usaha')) {
            Schema::create('vendor_izin_usaha', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('jenis_izin', 100);
                $table->string('nomor_surat', 150);
                $table->string('instansi_pemberi', 200);
                $table->boolean('seumur_hidup')->default(false);
                $table->date('berlaku_sampai')->nullable();
                $table->string('klasifikasi', 100)->nullable();
                $table->string('kualifikasi', 100)->nullable();
                $table->string('sumber_data', 100)->nullable();
                $table->string('file_dokumen', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_pemilik_saham')) {
            Schema::create('vendor_pemilik_saham', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('jenis_pemilik', 50);
                $table->string('nama', 200);
                $table->string('kewarganegaraan', 10)->default('WNI');
                $table->string('no_ktp_paspor', 50);
                $table->string('no_npwp', 30)->nullable();
                $table->text('alamat')->nullable();
                $table->decimal('jumlah_saham', 18, 2)->default(0);
                $table->decimal('persentase_saham', 5, 2)->default(0);
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_pengurus')) {
            Schema::create('vendor_pengurus', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('nama', 200);
                $table->string('kewarganegaraan', 10)->default('WNI');
                $table->string('nik_paspor', 50);
                $table->string('no_npwp', 30)->nullable();
                $table->string('no_bpjs_kesehatan', 50)->nullable();
                $table->string('no_bpjs_ketenagakerjaan', 50)->nullable();
                $table->string('jabatan', 100);
                $table->date('tanggal_menjabat_awal');
                $table->date('tanggal_menjabat_akhir')->nullable();
                $table->boolean('status_aktif')->default(true);
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_pengalaman')) {
            Schema::create('vendor_pengalaman', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('nama_kontrak', 255);
                $table->string('bidang_pekerjaan', 150);
                $table->string('lokasi_pekerjaan', 150)->nullable();
                $table->string('nama_instansi', 200);
                $table->string('nomor_kontrak', 150);
                $table->decimal('nilai_kontrak', 18, 2)->default(0);
                $table->decimal('persentase_pelaksanaan', 5, 2)->default(100);
                $table->date('tanggal_mulai');
                $table->date('tanggal_selesai');
                $table->date('tanggal_serah_terima')->nullable();
                $table->string('file_kontrak_bast', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_tenaga_ahli')) {
            Schema::create('vendor_tenaga_ahli', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('nama', 200);
                $table->string('jenis_tenaga', 50);
                $table->enum('jenis_kelamin', ['L', 'P'])->default('L');
                $table->string('tempat_lahir', 100)->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('no_telepon', 50)->nullable();
                $table->string('email', 150)->nullable();
                $table->string('nik_paspor', 50);
                $table->string('no_npwp', 30)->nullable();
                $table->string('pendidikan_terakhir', 100)->nullable();
                $table->integer('pengalaman_tahun')->default(0);
                $table->string('profesi_keahlian', 150);
                $table->enum('status_kerja', ['Tetap', 'Kontrak'])->default('Tetap');
                $table->string('file_dokumen', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('vendor_peralatan')) {
            Schema::create('vendor_peralatan', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('nama_peralatan', 150);
                $table->integer('jumlah')->default(1);
                $table->string('kapasitas', 100)->nullable();
                $table->string('merk_tipe', 150)->nullable();
                $table->integer('tahun_pembuatan')->nullable();
                $table->enum('kondisi', ['Baik', 'Rusak Ringan', 'Rusak Berat'])->default('Baik');
                $table->string('lokasi', 150)->nullable();
                $table->enum('status_kepemilikan', ['Milik Sendiri', 'Sewa Beli', 'Sewa'])->default('Milik Sendiri');
                $table->string('bukti_kepemilikan', 255)->nullable();
                $table->timestamp('created_at')->nullable();

                $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_peralatan');
        Schema::dropIfExists('vendor_tenaga_ahli');
        Schema::dropIfExists('vendor_pengalaman');
        Schema::dropIfExists('vendor_pengurus');
        Schema::dropIfExists('vendor_pemilik_saham');
        Schema::dropIfExists('vendor_izin_usaha');
        Schema::dropIfExists('vendor_akta');
        Schema::dropIfExists('vendors');
    }
};
