<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // 1. Import ini

class User extends Authenticatable
{
    use HasApiTokens; // 2. Gunakan di dalam class

    protected $table = 'users';
    protected $guarded = ['id'];
    protected $hidden = ['password_hash'];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
    public function vendor()
    {
        return $this->hasOne(Vendor::class, 'user_id');
    }
}
