<?php

namespace Modules\TreinamentosExames\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Funcionarios\Models\Employee;

class ExamEmployee extends Model
{
    use HasFactory;

    protected $table = 'exam_employee';

    protected $fillable = [
        'exam_id',
        'employee_id',
        'scheduled_at',
        'completed_at',
        'valid_until',
        'result',
        'document_path',
        'notes',
    ];

    protected $casts = [
        'scheduled_at' => 'date',
        'completed_at' => 'date',
        'valid_until' => 'date',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
