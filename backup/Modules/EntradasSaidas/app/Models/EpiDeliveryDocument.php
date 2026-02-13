<?php

namespace Modules\EntradasSaidas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class EpiDeliveryDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'type',
        'version',
        'original_name',
        'mime_type',
        'size',
        'storage_path',
        'generated_by',
        'signed_by',
    ];

    protected $casts = [
        'version' => 'integer',
        'size' => 'integer',
    ];

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(EpiDelivery::class, 'delivery_id');
    }

    public function url(): ?string
    {
        return $this->storage_path ? Storage::url($this->storage_path) : null;
    }
}
