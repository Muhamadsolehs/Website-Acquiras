<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('instansi')) {
            Schema::create('instansi', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('nama_instansi', 200);
                $table->string('jenis_instansi', 100)->nullable();
                $table->text('alamat')->nullable();
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('satker')) {
            Schema::create('satker', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('instansi_id')->nullable();
                $table->string('kode_satker', 50);
                $table->string('nama_satker', 200);
                $table->timestamp('created_at')->nullable();

                $table->foreign('instansi_id')->references('id')->on('instansi')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('satker');
        Schema::dropIfExists('instansi');
    }
};
