<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Satker extends Model
{
    protected $table = 'satker'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function instansi()
    {
        return $this->belongsTo(Instansi::class, 'instansi_id'); //[cite: 2]
    }

    public function rup()
    {
        return $this->hasMany(Rup::class, 'satker_id'); //[cite: 2]
    }
}
