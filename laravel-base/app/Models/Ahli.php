<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ahli extends Model
{
    protected $table = 'ahli'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]
}
