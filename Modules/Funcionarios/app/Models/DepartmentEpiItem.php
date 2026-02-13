<?php

namespace Modules\Funcionarios\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\CatalogoEpi\Models\Epi;

class DepartmentEpiItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'epi_id',
        'quantity',
        'notes',
        'size',
        'validity_days',
        'is_required',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'validity_days' => 'integer',
        'is_required' => 'boolean',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function epi(): BelongsTo
    {
        return $this->belongsTo(Epi::class);
    }
}
