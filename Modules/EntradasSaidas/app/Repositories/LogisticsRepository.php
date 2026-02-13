<?php

namespace Modules\EntradasSaidas\Repositories;

use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\CatalogoEpi\Models\Epi;
use Modules\EntradasSaidas\Models\EpiDelivery;
use Modules\EntradasSaidas\Models\EpiDeliveryItem;
use Modules\EntradasSaidas\Models\EpiDeliveryLog;
use Modules\EntradasSaidas\Models\EpiEntry;
use Modules\EntradasSaidas\Services\EpiDeliveryDocumentService;
use Modules\Funcionarios\Models\Employee;

class LogisticsRepository
{
    protected const STOCK_CACHE_KEY = 'logistics_repository.stock_positions';

    public static function deliveries(int $perPage = 15): LengthAwarePaginator
    {
        return EpiDelivery::query()
            ->with([
                'employee',
                'items.epi',
                'documents' => fn ($query) => $query->orderByDesc('version'),
            ])
            ->orderByDesc('delivered_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function stats(): Collection
    {
        return collect([
            'entries' => EpiEntry::count(),
            'deliveries' => EpiDelivery::count(),
            'openReturns' => EpiDelivery::whereNull('returned_at')->count(),
        ]);
    }

    public static function createEntry(array $attributes): EpiEntry
    {
        $entry = EpiEntry::create([
            'epi_id' => $attributes['epi_id'],
            'quantity' => $attributes['quantity'],
            'unit_cost' => $attributes['unit_cost'] ?? null,
            'total_cost' => self::calculateTotalCost($attributes['quantity'], $attributes['unit_cost'] ?? null),
            'supplier' => $attributes['supplier'] ?? null,
            'invoice_number' => $attributes['invoice_number'] ?? null,
            'invoice_date' => $attributes['invoice_date'] ?? null,
            'acquired_at' => $attributes['acquired_at'] ?? null,
            'expires_at' => $attributes['expires_at'] ?? null,
            'notes' => $attributes['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        self::forgetStockCache();

        return $entry;
    }

    public static function createDelivery(array $attributes): EpiDelivery
    {
        $deliveredAt = !empty($attributes['delivered_at'])
            ? Carbon::parse($attributes['delivered_at'])
            : now();

        $items = collect($attributes['items'] ?? self::legacyItemsPayload($attributes))
            ->filter(fn ($item) => !empty($item['epi_id']));

        if ($items->isEmpty()) {
            throw new \InvalidArgumentException('Delivery requires at least one item.');
        }

        $expectedReturn = !empty($attributes['expected_return_at'])
            ? Carbon::parse($attributes['expected_return_at'])
            : null;

        $delivery = EpiDelivery::create([
            'code' => $attributes['code'] ?? self::generateCode(),
            'employee_id' => $attributes['employee_id'],
            'delivered_at' => $deliveredAt->toDateString(),
            'expected_return_at' => $expectedReturn?->toDateString(),
            'status' => $attributes['status'] ?? 'entregue',
            'notes' => $attributes['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $calculatedExpectedDates = [];

        $items->each(function (array $item) use ($delivery, $attributes, $deliveredAt, &$calculatedExpectedDates) {
            $itemDeliveredAt = !empty($item['delivered_at'])
                ? Carbon::parse($item['delivered_at'])
                : $deliveredAt;

            $itemExpected = !empty($item['expected_return_at'])
                ? Carbon::parse($item['expected_return_at'])
                : self::calculateExpectedReturnDate(
                    (int) $item['epi_id'],
                    (int) $attributes['employee_id'],
                    $itemDeliveredAt
                );

            $delivery->items()->create([
                'epi_id' => (int) $item['epi_id'],
                'quantity' => isset($item['quantity']) ? (int) $item['quantity'] : 1,
                'delivered_at' => $itemDeliveredAt->toDateString(),
                'expected_return_at' => $itemExpected?->toDateString(),
                'notes' => $item['notes'] ?? null,
            ]);

            if ($itemExpected !== null) {
                $calculatedExpectedDates[] = $itemExpected;
            }
        });

        if ($expectedReturn === null && !empty($calculatedExpectedDates)) {
            $delivery->expected_return_at = collect($calculatedExpectedDates)
                ->max()
                ?->toDateString();
            $delivery->save();
        }

        EpiDeliveryLog::create([
            'delivery_id' => $delivery->id,
            'action' => 'criado',
            'changes' => null,
            'notes' => $attributes['notes'] ?? null,
            'performed_by' => Auth::id(),
        ]);

        $delivery->load(['items.epi', 'employee', 'documents']);

        app(EpiDeliveryDocumentService::class)->generate($delivery);

        self::forgetStockCache();

        return $delivery->fresh(['items.epi', 'documents', 'employee']);
    }

    public static function updateDelivery(EpiDelivery $delivery, array $attributes): EpiDelivery
    {
        return DB::transaction(function () use ($delivery, $attributes) {
            $deliveredAt = !empty($attributes['delivered_at'])
                ? Carbon::parse($attributes['delivered_at'])
                : now();

            $items = collect($attributes['items'] ?? self::legacyItemsPayload($attributes))
                ->filter(fn ($item) => !empty($item['epi_id']));

            if ($items->isEmpty()) {
                throw new \InvalidArgumentException('Delivery requires at least one item.');
            }

            $expectedReturn = !empty($attributes['expected_return_at'])
                ? Carbon::parse($attributes['expected_return_at'])
                : null;

            $delivery->update([
                'employee_id' => (int) $attributes['employee_id'],
                'delivered_at' => $deliveredAt->toDateString(),
                'expected_return_at' => $expectedReturn?->toDateString(),
                'status' => $attributes['status'] ?? $delivery->status,
                'notes' => $attributes['notes'] ?? null,
            ]);

            $delivery->items()->delete();

            $calculatedExpectedDates = [];

            $items->each(function (array $item) use ($delivery, $attributes, $deliveredAt, &$calculatedExpectedDates) {
                $itemDeliveredAt = !empty($item['delivered_at'])
                    ? Carbon::parse($item['delivered_at'])
                    : $deliveredAt;

                $itemExpected = !empty($item['expected_return_at'])
                    ? Carbon::parse($item['expected_return_at'])
                    : self::calculateExpectedReturnDate(
                        (int) $item['epi_id'],
                        (int) $attributes['employee_id'],
                        $itemDeliveredAt
                    );

                $delivery->items()->create([
                    'epi_id' => (int) $item['epi_id'],
                    'quantity' => isset($item['quantity']) ? (int) $item['quantity'] : 1,
                    'delivered_at' => $itemDeliveredAt->toDateString(),
                    'expected_return_at' => $itemExpected?->toDateString(),
                    'notes' => $item['notes'] ?? null,
                ]);

                if ($itemExpected !== null) {
                    $calculatedExpectedDates[] = $itemExpected;
                }
            });

            if ($expectedReturn === null && !empty($calculatedExpectedDates)) {
                $delivery->expected_return_at = collect($calculatedExpectedDates)
                    ->max()
                    ?->toDateString();
                $delivery->save();
            }

            EpiDeliveryLog::create([
                'delivery_id' => $delivery->id,
                'action' => 'atualizado',
                'changes' => null,
                'notes' => $attributes['notes'] ?? null,
                'performed_by' => Auth::id(),
            ]);

            $delivery->load(['items.epi', 'employee', 'documents']);

            app(EpiDeliveryDocumentService::class)->generate($delivery);

            self::forgetStockCache();

            return $delivery->fresh(['items.epi', 'documents', 'employee']);
        });
    }

    public static function deleteDelivery(EpiDelivery $delivery): void
    {
        DB::transaction(function () use ($delivery) {
            $delivery->load(['documents']);

            foreach ($delivery->documents as $document) {
                if ($document->storage_path && Storage::exists($document->storage_path)) {
                    Storage::delete($document->storage_path);
                }

                $document->delete();
            }

            $delivery->items()->delete();

            EpiDeliveryLog::create([
                'delivery_id' => $delivery->id,
                'action' => 'cancelado',
                'changes' => null,
                'notes' => null,
                'performed_by' => Auth::id(),
            ]);

            $delivery->delete();
        });

        self::forgetStockCache();
    }

    public static function mostUsedEpis(int $limit = 5): Collection
    {
        return EpiDeliveryItem::query()
            ->join('epis', 'epis.id', '=', 'epi_delivery_items.epi_id')
            ->select('epis.id', 'epis.name')
            ->selectRaw('SUM(epi_delivery_items.quantity) as total')
            ->groupBy('epis.id', 'epis.name')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'name' => $row->name,
                'total' => (int) $row->total,
            ]);
    }

    public static function mostValuableStockEpis(int $limit = 5): Collection
    {
        $entriesSubquery = EpiEntry::query()
            ->selectRaw('epi_id, SUM(quantity) as total_entries, SUM(total_cost) as total_cost')
            ->groupBy('epi_id');

        $deliveriesSubquery = EpiDeliveryItem::query()
            ->selectRaw('epi_delivery_items.epi_id, SUM(epi_delivery_items.quantity) as total_deliveries')
            ->join('epi_deliveries', 'epi_deliveries.id', '=', 'epi_delivery_items.delivery_id')
            ->whereNull('epi_deliveries.returned_at')
            ->groupBy('epi_delivery_items.epi_id');

        return Epi::query()
            ->leftJoinSub($entriesSubquery, 'entry_totals', 'entry_totals.epi_id', '=', 'epis.id')
            ->leftJoinSub($deliveriesSubquery, 'delivery_totals', 'delivery_totals.epi_id', '=', 'epis.id')
            ->select([
                'epis.id',
                'epis.name',
                    'epis.ca_number',
            ])
            ->selectRaw('COALESCE(entry_totals.total_entries, 0) as total_entries')
            ->selectRaw('COALESCE(entry_totals.total_cost, 0) as total_cost')
            ->selectRaw('COALESCE(delivery_totals.total_deliveries, 0) as total_deliveries')
            ->selectRaw('GREATEST(COALESCE(entry_totals.total_entries, 0) - COALESCE(delivery_totals.total_deliveries, 0), 0) as available')
            ->selectRaw('CASE WHEN COALESCE(entry_totals.total_entries, 0) > 0 THEN entry_totals.total_cost / entry_totals.total_entries ELSE 0 END as unit_cost')
            ->selectRaw('GREATEST(COALESCE(entry_totals.total_entries, 0) - COALESCE(delivery_totals.total_deliveries, 0), 0) * CASE WHEN COALESCE(entry_totals.total_entries, 0) > 0 THEN entry_totals.total_cost / entry_totals.total_entries ELSE 0 END as total_value')
            ->orderByDesc('total_value')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'name' => $row->name,
                'total_value' => round((float) $row->total_value, 2),
            ]);
    }    public static function deliveriesForEmployee(int $employeeId): Collection
    {
        return EpiDelivery::query()
            ->with([
                'items.epi:id,name',
                'logs' => fn ($query) => $query->orderByDesc('created_at')->limit(5),
            ])
            ->where('employee_id', $employeeId)
            ->orderByDesc('delivered_at')
            ->get();
    }

    public static function deliveryStatuses(): array
    {
        return ['entregue', 'em_uso', 'devolvido', 'perdido'];
    }

    public static function stockPositions(): Collection
    {
        $entriesSubquery = EpiEntry::query()
            ->selectRaw('epi_id, SUM(quantity) as total_entries')
            ->groupBy('epi_id');

        $deliveriesSubquery = EpiDeliveryItem::query()
            ->selectRaw('epi_delivery_items.epi_id, SUM(epi_delivery_items.quantity) as total_deliveries')
            ->join('epi_deliveries', 'epi_deliveries.id', '=', 'epi_delivery_items.delivery_id')
            ->whereNull('epi_deliveries.returned_at')
            ->groupBy('epi_delivery_items.epi_id');

        return Cache::remember(self::STOCK_CACHE_KEY, now()->addSeconds(60), function () use ($entriesSubquery, $deliveriesSubquery) {
            return Epi::query()
                ->leftJoinSub($entriesSubquery, 'entry_totals', 'entry_totals.epi_id', '=', 'epis.id')
                ->leftJoinSub($deliveriesSubquery, 'delivery_totals', 'delivery_totals.epi_id', '=', 'epis.id')
                ->select([
                    'epis.id',
                    'epis.name',
                    'epis.ca_number',
                    'epis.min_stock',
                ])
                ->selectRaw('COALESCE(entry_totals.total_entries, 0) as total_entries')
                ->selectRaw('COALESCE(delivery_totals.total_deliveries, 0) as total_deliveries')
                ->orderBy('epis.name')
                ->get()
                ->map(function ($item) {
                    $entries = (int) ($item->total_entries ?? 0);
                    $deliveries = (int) ($item->total_deliveries ?? 0);
                    $available = $entries - $deliveries;
                    $minStock = $item->min_stock !== null ? (int) $item->min_stock : null;

                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'min_stock' => $minStock,
                        'total_entries' => $entries,
                        'total_deliveries' => $deliveries,
                        'available' => $available,
                        'is_below_min' => $minStock !== null && $available <= $minStock,
                    ];
                });
        });
    }

    protected static function generateCode(): string
    {
        do {
            $code = 'SA-'.Str::upper(Str::random(6));
        } while (EpiDelivery::where('code', $code)->exists());

        return $code;
    }

    protected static function calculateTotalCost(int $quantity, ?string $unitCost): ?float
    {
        if ($unitCost === null || $unitCost === '') {
            return null;
        }

        return round((float) $unitCost * $quantity, 2);
    }

    protected static function legacyItemsPayload(array $attributes): array
    {
        if (empty($attributes['epi_id'])) {
            return [];
        }

        return [[
            'epi_id' => (int) $attributes['epi_id'],
            'quantity' => isset($attributes['quantity']) ? (int) $attributes['quantity'] : 1,
            'notes' => $attributes['notes'] ?? null,
            'delivered_at' => $attributes['delivered_at'] ?? null,
            'expected_return_at' => $attributes['expected_return_at'] ?? null,
        ]];
    }

    protected static function calculateExpectedReturnDate(int $epiId, int $employeeId, Carbon $deliveredAt): ?Carbon
    {
        $employee = Employee::query()
            ->select('id', 'position_id')
            ->with('position:id,epi_return_days')
            ->find($employeeId);

        $epi = Epi::query()
            ->select('id', 'category_id', 'return_days')
            ->with('category:id,default_return_days')
            ->find($epiId);

        $days = $employee?->position?->epi_return_days;

        if ($days === null && $epi?->return_days !== null) {
            $days = $epi->return_days;
        }

        if ($days === null && $epi?->category?->default_return_days !== null) {
            $days = $epi->category->default_return_days;
        }

        if ($days === null || (int) $days <= 0) {
            return null;
        }

        return $deliveredAt->copy()->addDays((int) $days);
    }

    protected static function forgetStockCache(): void
    {
        Cache::forget(self::STOCK_CACHE_KEY);
    }
}








