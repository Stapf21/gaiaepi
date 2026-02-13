<?php

namespace Modules\Dashboard\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Configuracoes\Models\SystemSetting;
use Modules\EntradasSaidas\Models\EpiDelivery;
use Modules\Funcionarios\Models\Employee;
use Modules\EntradasSaidas\Repositories\LogisticsRepository;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $alertDays = (int) (SystemSetting::query()
            ->where('key', 'alerts.epi_days_before_due')
            ->value('value') ?? 5);
        $alertDays = $alertDays > 0 ? $alertDays : 5;
        $alertThreshold = now()->addDays($alertDays);

        $alertDeliveries = EpiDelivery::query()
            ->whereNull('returned_at')
            ->whereNotNull('expected_return_at')
            ->whereDate('expected_return_at', '<=', $alertThreshold)
            ->with([
                'employee:id,name',
                'items.epi:id,name',
            ])
            ->orderBy('expected_return_at')
            ->get();

        $alertDetails = $alertDeliveries->map(function (EpiDelivery $delivery) {
            $expectedReturn = $delivery->expected_return_at;
            $daysRemaining = $expectedReturn ? now()->diffInDays($expectedReturn, false) : null;
            $items = $delivery->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->epi?->name,
                'quantity' => $item->quantity,
            ])->values();
            $primaryItem = $items->first();

            return [
                'id' => $delivery->id,
                'employee' => $delivery->employee?->name,
                'epi' => $primaryItem['name'] ?? null,
                'items' => $items,
                'expected_return_at' => $expectedReturn?->format('d/m/Y'),
                'days_remaining' => $daysRemaining,
            ];
        });

        $stockPositions = LogisticsRepository::stockPositions();
        $lowStockDetails = $stockPositions
            ->filter(fn ($item) => $item['is_below_min'])
            ->map(function ($item) {
                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'current_stock' => $item['available'],
                    'min_stock' => $item['min_stock'],
                ];
            })
            ->values();

        $funcionariosAtivos = Employee::query()
            ->where('status', 'ativo')
            ->count();

        $episEmUso = EpiDelivery::query()
            ->whereNull('returned_at')
            ->count();

        $mostUsedEpis = LogisticsRepository::mostUsedEpis(5);
        $mostValuableStock = LogisticsRepository::mostValuableStockEpis(5);

        return Inertia::render('Dashboard/Overview', [
            'stats' => [
                'alertaEpi' => $alertDetails->count(),
                'estoqueBaixo' => $lowStockDetails->count(),
                'funcionariosAtivos' => $funcionariosAtivos,
                'episEmUso' => $episEmUso,
            ],
            'alerts' => $alertDetails->values(),
            'lowStockItems' => $lowStockDetails->values(),
            'recentAlerts' => self::buildRecentAlerts($alertDetails),
            'charts' => [
                'mostUsedEpis' => $mostUsedEpis,
                'mostValuableStock' => $mostValuableStock,
            ],
        ]);
    }

    protected static function buildRecentAlerts(Collection $alerts): Collection
    {
        return $alerts
            ->sortBy('days_remaining')
            ->take(5)
            ->values();
    }
}






