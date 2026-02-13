<?php

namespace Modules\AcidentesRelatorios\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Modules\AcidentesRelatorios\Models\Accident;
use Modules\AcidentesRelatorios\Models\AccidentEmployee;
use Modules\AcidentesRelatorios\Models\AccidentType;

class AccidentRepository
{
    public static function recent(int $perPage = 15): LengthAwarePaginator
    {
        return Accident::query()
            ->with(['type'])
            ->orderByDesc('occurred_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function stats(): Collection
    {
        return collect([
            'totalAccidents' => Accident::count(),
            'openInvestigations' => Accident::where('status', 'em_investigacao')->count(),
            'closedAccidents' => Accident::where('status', 'encerrado')->count(),
            'types' => AccidentType::count(),
        ]);
    }

    public static function create(array $attributes): Accident
    {
        $employeeIds = $attributes['employee_ids'] ?? [];

        $accident = Accident::create([
            'protocol' => $attributes['protocol'] ?? self::generateProtocol(),
            'accident_type_id' => $attributes['accident_type_id'],
            'occurred_at' => $attributes['occurred_at'],
            'occurred_time' => $attributes['occurred_time'] ?? null,
            'location' => $attributes['location'] ?? null,
            'severity' => $attributes['severity'],
            'description' => $attributes['description'] ?? null,
            'root_cause' => $attributes['root_cause'] ?? null,
            'corrective_action' => $attributes['corrective_action'] ?? null,
            'status' => $attributes['status'] ?? 'em_investigacao',
            'reported_by' => $attributes['reported_by'] ?? null,
            'metadata' => $attributes['metadata'] ?? null,
        ]);

        foreach ($employeeIds as $employeeId) {
            AccidentEmployee::create([
                'accident_id' => $accident->id,
                'employee_id' => $employeeId,
                'role' => null,
                'injury_description' => null,
                'days_off' => null,
                'medical_attention' => false,
                'notes' => null,
            ]);
        }

        return $accident;
    }

    public static function severityOptions(): array
    {
        return [
            ['value' => 'leve', 'label' => 'Leve'],
            ['value' => 'moderado', 'label' => 'Moderado'],
            ['value' => 'grave', 'label' => 'Grave'],
            ['value' => 'critico', 'label' => 'Critico'],
        ];
    }

    public static function statusOptions(): array
    {
        return [
            ['value' => 'em_investigacao', 'label' => 'Em investigacao'],
            ['value' => 'em_tratamento', 'label' => 'Em tratamento'],
            ['value' => 'encerrado', 'label' => 'Encerrado'],
        ];
    }

    protected static function generateProtocol(): string
    {
        $datePrefix = now()->format('Ymd');

        do {
            $protocol = sprintf('AC-%s-%s', $datePrefix, Str::upper(Str::random(4)));
        } while (Accident::where('protocol', $protocol)->exists());

        return $protocol;
    }
}
