<?php

namespace Modules\AcidentesRelatorios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Funcionarios\Models\Employee;

class Accident extends Model
{
    use HasFactory;

    protected $fillable = [
        'protocol',
        'accident_type_id',
        'occurred_at',
        'occurred_time',
        'location',
        'severity',
        'description',
        'root_cause',
        'corrective_action',
        'status',
        'reported_by',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'occurred_at' => 'date',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(AccidentType::class, 'accident_type_id');
    }

    public function involved(): HasMany
    {
        return $this->hasMany(AccidentEmployee::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(AccidentDocument::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reported_by');
    }
}
