<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instansi extends Model
{
    protected $table = 'instansi'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function satker()
    {
        return $this->hasMany(Satker::class, 'instansi_id'); //[cite: 2]
    }
}
