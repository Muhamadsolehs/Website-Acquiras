<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PekerjaanMilestone extends Model
{
    protected $table = 'pekerjaan_milestone'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function kontrak()
    {
        return $this->belongsTo(KontrakPekerjaan::class, 'kontrak_id'); //[cite: 2]
    }
}
