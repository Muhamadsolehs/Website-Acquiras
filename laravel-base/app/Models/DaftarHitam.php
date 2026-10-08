<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaftarHitam extends Model
{
    protected $table = 'daftar_hitam'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id'); //[cite: 2]
    }

    public function paket()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id'); //[cite: 2]
    }
}
