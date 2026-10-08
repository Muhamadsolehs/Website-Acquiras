<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $table = 'vendors'; //[cite: 2]
    protected $guarded = ['id'];
    // Tabel ini memiliki created_at dan updated_at[cite: 2]

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); //[cite: 2]
    }

    public function akta()
    {
        return $this->hasMany(VendorAkta::class, 'vendor_id');
    } //[cite: 2]
    public function izinUsaha()
    {
        return $this->hasMany(VendorIzinUsaha::class, 'vendor_id');
    } //[cite: 2]
    public function pemilikSaham()
    {
        return $this->hasMany(VendorPemilikSaham::class, 'vendor_id');
    } //[cite: 2]
    public function pengalaman()
    {
        return $this->hasMany(VendorPengalaman::class, 'vendor_id');
    } //[cite: 2]
    public function pengurus()
    {
        return $this->hasMany(VendorPengurus::class, 'vendor_id');
    } //[cite: 2]
    public function peralatan()
    {
        return $this->hasMany(VendorPeralatan::class, 'vendor_id');
    } //[cite: 2]
    public function tenagaAhli()
    {
        return $this->hasMany(VendorTenagaAhli::class, 'vendor_id');
    } //[cite: 2]
}
