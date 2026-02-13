<?php

namespace Modules\TreinamentosExames\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Funcionarios\Models\Employee;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'code',
        'description',
        'validity_months',
        'workload_hours',
        'mandatory',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'mandatory' => 'boolean',
    ];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'training_employee')
            ->withPivot(['scheduled_at', 'completed_at', 'valid_until', 'status', 'certificate_path', 'notes'])
            ->withTimestamps();
    }
}
