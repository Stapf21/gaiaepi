<?php

namespace Modules\TreinamentosExames\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Funcionarios\Models\Employee;

class TrainingEmployee extends Model
{
    use HasFactory;

    protected $table = 'training_employee';

    protected $fillable = [
        'training_id',
        'employee_id',
        'scheduled_at',
        'completed_at',
        'valid_until',
        'status',
        'certificate_path',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'date',
        'completed_at' => 'date',
        'valid_until' => 'date',
    ];

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
