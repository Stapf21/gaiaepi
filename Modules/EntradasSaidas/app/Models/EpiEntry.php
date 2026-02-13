<?php

namespace Modules\EntradasSaidas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\CatalogoEpi\Models\Epi;

class EpiEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'epi_id',
        'quantity',
        'unit_cost',
        'total_cost',
        'supplier',
        'invoice_number',
        'invoice_date',
        'acquired_at',
        'expires_at',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'acquired_at' => 'date',
        'expires_at' => 'date',
    ];

    public function epi(): BelongsTo
    {
        return $this->belongsTo(Epi::class);
    }
}
