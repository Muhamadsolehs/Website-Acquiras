<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles'; //[cite: 2]
    protected $guarded = ['id'];
    const UPDATED_AT = null; //[cite: 2]

    public function users()
    {
        return $this->hasMany(User::class, 'role_id'); //[cite: 2]
    }
}
