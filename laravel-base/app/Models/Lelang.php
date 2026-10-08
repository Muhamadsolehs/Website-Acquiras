<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lelang extends Model
{
    protected $table = 'lelang'; //[cite: 2]
    protected $guarded = ['id'];
    // Tabel ini memiliki created_at dan updated_at[cite: 2]

    public function paket()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id'); //[cite: 2]
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by'); //[cite: 2]
    }

    public function peserta()
    {
        return $this->hasMany(LelangPeserta::class, 'lelang_id'); //[cite: 2]
    }

    public function sanggahan()
    {
        return $this->hasMany(Sanggahan::class, 'lelang_id'); //[cite: 2]
    }
}
