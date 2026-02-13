<?php

namespace Modules\Funcionarios\Repositories;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Modules\Funcionarios\Models\Department;

class DepartmentEpiRepository
{
    protected const CACHE_KEY = 'department_epi_repository.kits';

    public static function syncItems(Department $department, array $items): void
    {
        $payload = collect($items)
            ->filter(function (array $item) {
                return !empty($item['epi_id']);
            })
            ->map(function (array $item) {
                $quantity = isset($item['quantity']) ? (int) $item['quantity'] : 1;

                return [
                    'epi_id' => (int) $item['epi_id'],
                    'quantity' => $quantity > 0 ? $quantity : 1,
                    'notes' => ($item['notes'] ?? null) !== '' ? $item['notes'] : null,
                    'size' => ($item['size'] ?? null) !== '' ? $item['size'] : null,
                    'validity_days' => isset($item['validity_days']) && $item['validity_days'] !== ''
                        ? (int) $item['validity_days']
                        : null,
                    'is_required' => (bool) ($item['is_required'] ?? false),
                ];
            })
            ->values();

        $department->defaultEpiItems()->delete();

        if ($payload->isEmpty()) {
            Cache::forget(self::CACHE_KEY);
            return;
        }

        $department->defaultEpiItems()->createMany(
            $payload->map(function (array $item) {
                return [
                    ...$item,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray()
        );

        Cache::forget(self::CACHE_KEY);
    }

    public static function kits(): Collection
    {
        return Cache::remember(self::CACHE_KEY, now()->addMinutes(10), function () {
            return Department::query()
                ->with(['defaultEpiItems.epi:id,name'])
                ->whereHas('defaultEpiItems')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(function (Department $department) {
                    return [
                        'department_id' => $department->id,
                        'department' => $department->name,
                        'items' => $department->defaultEpiItems
                            ->map(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'epi_id' => $item->epi_id,
                                    'epi' => $item->epi?->name,
                                    'quantity' => (int) $item->quantity,
                                    'notes' => $item->notes,
                                    'size' => $item->size,
                                    'validity_days' => $item->validity_days,
                                    'is_required' => (bool) $item->is_required,
                                ];
                            })
                            ->values(),
                    ];
                })
                ->values();
        });
    }
}
