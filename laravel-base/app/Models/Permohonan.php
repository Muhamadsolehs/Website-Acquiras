<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    protected $table = 'permohonan'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function pemohon()
    {
        return $this->belongsTo(Pemohon::class, 'pemohon_id'); //[cite: 2]
    }

    public function ahli()
    {
        return $this->belongsTo(Ahli::class, 'ahli_id'); //[cite: 2]
    }
}
