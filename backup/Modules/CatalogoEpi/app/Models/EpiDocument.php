<?php

namespace Modules\CatalogoEpi\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EpiDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'epi_id',
        'name',
        'type',
        'path',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function epi(): BelongsTo
    {
        return $this->belongsTo(Epi::class);
    }
}
