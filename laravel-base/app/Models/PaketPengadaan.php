<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaketPengadaan extends Model
{
    protected $table = 'paket_pengadaan'; //[cite: 2]
    protected $guarded = ['id'];
    // Tabel ini memiliki created_at dan updated_at[cite: 2]

    public function rup()
    {
        return $this->belongsTo(Rup::class, 'rup_id'); //[cite: 2]
    }

    public function satker()
    {
        return $this->belongsTo(Satker::class, 'satker_id'); //[cite: 2]
    }

    public function lelang()
    {
        return $this->hasMany(Lelang::class, 'paket_id'); //[cite: 2]
    }

    public function kontrak()
    {
        return $this->hasMany(KontrakPekerjaan::class, 'paket_id'); //[cite: 2]
    }
}
