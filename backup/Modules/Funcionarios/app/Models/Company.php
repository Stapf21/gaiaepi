<?php

namespace Modules\Funcionarios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'legal_name',
        'document',
        'registration_code',
        'email',
        'phone',
        'website',
        'address',
        'number',
        'complement',
        'district',
        'city',
        'state',
        'zip_code',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
