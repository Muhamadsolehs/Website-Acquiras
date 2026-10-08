<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LelangPeserta extends Model
{
    protected $table = 'lelang_peserta'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function lelang()
    {
        return $this->belongsTo(Lelang::class, 'lelang_id'); //[cite: 2]
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id'); //[cite: 2]
    }
}
