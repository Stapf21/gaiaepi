<?php

namespace Modules\Funcionarios\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeTerminationReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'terminated_by',
        'terminated_at',
        'report',
        'delivered_items_count',
        'pending_items_count',
        'notes',
    ];

    protected $casts = [
        'terminated_at' => 'date',
        'report' => 'array',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function terminatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'terminated_by');
    }
}
