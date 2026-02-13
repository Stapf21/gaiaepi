<?php

namespace Modules\AcidentesRelatorios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccidentDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'accident_id',
        'name',
        'type',
        'path',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }
}
