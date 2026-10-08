<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rup extends Model
{
    protected $table = 'rup'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function satker()
    {
        return $this->belongsTo(Satker::class, 'satker_id'); //[cite: 2]
    }

    public function paket()
    {
        return $this->hasMany(PaketPengadaan::class, 'rup_id'); //[cite: 2]
    }
}
