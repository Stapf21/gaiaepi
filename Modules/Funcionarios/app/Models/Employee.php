<?php

namespace Modules\Funcionarios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'department_id',
        'position_id',
        'registration_number',
        'name',
        'email',
        'cpf',
        'rg',
        'birth_date',
        'phone',
        'mobile_phone',
        'hire_date',
        'termination_date',
        'status',
        'work_shift',
        'address',
        'metadata',
    ];

    protected $casts = [
        'address' => 'array',
        'metadata' => 'array',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'birth_date' => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(EmployeePositionHistory::class);
    }

    public function terminationReports(): HasMany
    {
        return $this->hasMany(EmployeeTerminationReport::class);
    }
}
