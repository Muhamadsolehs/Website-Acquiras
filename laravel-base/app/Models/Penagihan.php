<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penagihan extends Model
{
    protected $table = 'penagihan'; //[cite: 2]
    protected $guarded = ['id'];
    // Tabel ini memiliki created_at dan updated_at[cite: 2]

    public function kontrak()
    {
        return $this->belongsTo(KontrakPekerjaan::class, 'kontrak_id'); //[cite: 2]
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id'); //[cite: 2]
    }
}
