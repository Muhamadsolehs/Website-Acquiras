<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $table = 'system_settings'; //[cite: 2]
    protected $guarded = ['id'];
    const CREATED_AT = null; // Tabel ini hanya punya updated_at[cite: 2]
}
