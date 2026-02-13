<?php

namespace Modules\AcidentesRelatorios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Funcionarios\Models\Employee;

class AccidentEmployee extends Model
{
    use HasFactory;

    protected $fillable = [
        'accident_id',
        'employee_id',
        'role',
        'injury_description',
        'days_off',
        'medical_attention',
        'notes',
    ];

    protected $casts = [
        'medical_attention' => 'boolean',
    ];

    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
