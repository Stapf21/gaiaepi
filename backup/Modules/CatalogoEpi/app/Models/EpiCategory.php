<?php

namespace Modules\CatalogoEpi\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EpiCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'default_return_days',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function epis(): HasMany
    {
        return $this->hasMany(Epi::class, 'category_id');
    }
}
