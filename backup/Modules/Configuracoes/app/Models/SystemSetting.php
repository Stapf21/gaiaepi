<?php

namespace Modules\Configuracoes\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $table = 'system_settings';

    protected $fillable = [
        'group',
        'key',
        'label',
        'value',
        'type',
        'meta',
        'is_encrypted',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_encrypted' => 'boolean',
    ];
}