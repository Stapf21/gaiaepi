<?php

namespace Modules\TreinamentosExames\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Funcionarios\Models\Employee;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'type',
        'validity_months',
        'description',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'exam_employee')
            ->withPivot(['scheduled_at', 'completed_at', 'valid_until', 'result', 'document_path', 'notes'])
            ->withTimestamps();
    }
}
