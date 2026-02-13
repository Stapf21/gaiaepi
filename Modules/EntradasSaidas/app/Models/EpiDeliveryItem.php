<?php

namespace Modules\EntradasSaidas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\CatalogoEpi\Models\Epi;

class EpiDeliveryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'epi_id',
        'quantity',
        'delivered_at',
        'expected_return_at',
        'notes',
    ];

    protected $casts = [
        'delivered_at' => 'date',
        'expected_return_at' => 'date',
    ];

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(EpiDelivery::class, 'delivery_id');
    }

    public function epi(): BelongsTo
    {
        return $this->belongsTo(Epi::class);
    }
}
