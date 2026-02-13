<?php

namespace Modules\EntradasSaidas\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Funcionarios\Models\Employee;

class EpiDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'employee_id',
        'delivered_at',
        'expected_return_at',
        'returned_at',
        'status',
        'condition_on_return',
        'notes',
        'created_by',
        'returned_by',
        'signature_path',
        'signature_signed_name',
        'signature_signed_at',
        'signature_collected_by',
        'signature_metadata',
    ];

    protected $casts = [
        'delivered_at' => 'date',
        'expected_return_at' => 'date',
        'returned_at' => 'date',
        'signature_signed_at' => 'datetime',
        'signature_metadata' => 'array',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(EpiDeliveryItem::class, 'delivery_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(EpiDeliveryLog::class, 'delivery_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(EpiDeliveryDocument::class, 'delivery_id');
    }

    public function signatureCollector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signature_collected_by');
    }
}
