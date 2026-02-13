<?php

namespace Modules\EntradasSaidas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EpiDeliveryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'action',
        'changes',
        'notes',
        'performed_by',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(EpiDelivery::class, 'delivery_id');
    }
}
