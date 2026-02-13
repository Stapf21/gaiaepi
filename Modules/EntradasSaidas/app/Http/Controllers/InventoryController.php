<?php

namespace Modules\EntradasSaidas\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\EntradasSaidas\Http\Requests\StoreStockEntryRequest;
use Modules\EntradasSaidas\Repositories\LogisticsRepository;
use Modules\CatalogoEpi\Models\Epi;
use Modules\CatalogoEpi\Models\EpiCategory;
use Modules\CatalogoEpi\Repositories\EpiRepository;

class InventoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Administrativo/Estoque/Index', [
            'items' => LogisticsRepository::stockPositions()->values(),
            'catalogStats' => EpiRepository::stats(),
            'epis' => EpiRepository::paginatedList()->through(function ($epi) {
                return [
                    'id' => $epi->id,
                    'name' => $epi->name,
                    'category' => $epi->category?->name,
                    'ca_number' => $epi->ca_number,
                    'unit' => $epi->unit,
                    'return_days' => $epi->return_days,
                    'min_stock' => $epi->min_stock,
                ];
            }),
            'categories' => EpiCategory::query()
                ->orderBy('name')
                ->get(['id', 'name', 'description', 'default_return_days']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Administrativo/Estoque/Entrada', [
            'epis' => Epi::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreStockEntryRequest $request): RedirectResponse
    {
        $data = collect($request->validated())
            ->map(fn ($value) => $value === '' ? null : $value)
            ->toArray();

        $data['quantity'] = (int) $data['quantity'];

        LogisticsRepository::createEntry($data);

        return redirect()
            ->route('administrativo.estoque.index')
            ->with('success', 'Entrada de estoque registrada com sucesso.');
    }
}

