<?php

namespace Modules\Funcionarios\Services;

use Illuminate\Support\Collection;
use Modules\EntradasSaidas\Repositories\LogisticsRepository;
use Modules\Funcionarios\Models\Employee;

class EmployeeEquipmentReportService
{
    public function build(Employee $employee): array
    {
        $deliveries = LogisticsRepository::deliveriesForEmployee($employee->id);

        $deliveredItems = [];
        $pendingItems = [];

        $deliveries->each(function ($delivery) use (&$deliveredItems, &$pendingItems) {
            foreach ($delivery->items as $item) {
                $row = [
                    'delivery_id' => $delivery->id,
                    'delivery_code' => $delivery->code ?? sprintf('SA-%05d', $delivery->id),
                    'epi' => $item->epi?->name,
                    'quantity' => (int) $item->quantity,
                    'delivered_at' => optional($item->delivered_at)->format('d/m/Y'),
                    'expected_return_at' => optional($item->expected_return_at)->format('d/m/Y'),
                    'status' => $delivery->status,
                ];

                $deliveredItems[] = $row;

                if ($delivery->returned_at === null) {
                    $pendingItems[] = $row;
                }
            }
        });

        return [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'department' => $employee->department?->name,
                'position' => $employee->position?->name,
            ],
            'delivered_items' => $deliveredItems,
            'pending_items' => $pendingItems,
            'summary' => [
                'total_deliveries' => $deliveries->count(),
                'total_items' => collect($deliveredItems)->sum('quantity'),
                'pending_items' => collect($pendingItems)->sum('quantity'),
                'open_deliveries' => $deliveries->whereNull('returned_at')->count(),
            ],
        ];
    }
}
