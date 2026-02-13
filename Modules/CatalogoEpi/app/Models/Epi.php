<?php

namespace Modules\CatalogoEpi\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Epi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'ca_number',
        'description',
        'unit',
        'size',
        'min_stock',
        'max_stock',
        'return_days',
        'requires_validation',
        'unit_cost',
        'metadata',
    ];

    protected $casts = [
        'requires_validation' => 'boolean',
        'metadata' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(EpiCategory::class, 'category_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EpiDocument::class);
    }
}
