<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KontrakPekerjaan extends Model
{
    protected $table = 'kontrak_pekerjaan'; //[cite: 2]
    protected $guarded = ['id'];
    // Tabel ini memiliki created_at dan updated_at[cite: 2]

    public function paket()
    {
        return $this->belongsTo(PaketPengadaan::class, 'paket_id'); //[cite: 2]
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id'); //[cite: 2]
    }

    public function milestone()
    {
        return $this->hasMany(PekerjaanMilestone::class, 'kontrak_id'); //[cite: 2]
    }

    public function penagihan()
    {
        return $this->hasMany(Penagihan::class, 'kontrak_id'); //[cite: 2]
    }
}
