<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPemilikSaham extends Model
{
    protected $table = 'vendor_pemilik_saham'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id'); //[cite: 2]
    }
}
