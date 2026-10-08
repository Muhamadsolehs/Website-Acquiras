<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemohon extends Model
{
    protected $table = 'pemohon'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]
}
