<?php

namespace Modules\CatalogoEpi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Modules\CatalogoEpi\Http\Requests\StoreEpiRequest;
use Modules\CatalogoEpi\Models\Epi;
use Modules\CatalogoEpi\Models\EpiCategory;
use Modules\CatalogoEpi\Repositories\EpiRepository;

class CatalogoEpiController extends Controller
{
    public function index(): RedirectResponse
    {
        return redirect()->route('administrativo.estoque.index');
    }

    public function create(): Response
    {
        return Inertia::render('CatalogoEpi/Create', [
            'categories' => EpiCategory::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreEpiRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['requires_validation'] = (bool) ($data['requires_validation'] ?? false);

        EpiRepository::create($data);

        return redirect()
            ->route('catalogoepi.index')
            ->with('success', 'EPI cadastrado com sucesso.');
    }
    public function show(Epi $catalogoepi): Response
    {
        $catalogoepi->load('category:id,name');

        return Inertia::render('CatalogoEpi/Show', [
            'epi' => [
                'id' => $catalogoepi->id,
                'name' => $catalogoepi->name,
                'category' => $catalogoepi->category?->name,
                'ca_number' => $catalogoepi->ca_number,
                'unit' => $catalogoepi->unit,
                'size' => $catalogoepi->size,
                'min_stock' => $catalogoepi->min_stock,
                'max_stock' => $catalogoepi->max_stock,
                'return_days' => $catalogoepi->return_days,
                'requires_validation' => $catalogoepi->requires_validation,
                'unit_cost' => $catalogoepi->unit_cost,
                'description' => $catalogoepi->description,
            ],
        ]);
    }

    public function edit(Epi $catalogoepi): Response
    {
        $catalogoepi->load('category:id,name');

        return Inertia::render('CatalogoEpi/Edit', [
            'epi' => [
                'id' => $catalogoepi->id,
                'category_id' => $catalogoepi->category_id,
                'name' => $catalogoepi->name,
                'ca_number' => $catalogoepi->ca_number,
                'description' => $catalogoepi->description,
                'unit' => $catalogoepi->unit,
                'size' => $catalogoepi->size,
                'min_stock' => $catalogoepi->min_stock,
                'max_stock' => $catalogoepi->max_stock,
                'return_days' => $catalogoepi->return_days,
                'requires_validation' => (bool) $catalogoepi->requires_validation,
                'unit_cost' => $catalogoepi->unit_cost,
            ],
            'categories' => EpiCategory::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(StoreEpiRequest $request, Epi $catalogoepi): RedirectResponse
    {
        $data = $request->validated();
        $data['requires_validation'] = (bool) ($data['requires_validation'] ?? false);

        if (($data['name'] ?? $catalogoepi->name) !== $catalogoepi->name) {
            $slug = Str::slug($data['name']);

            if (Epi::where('slug', $slug)->where('id', '!=', $catalogoepi->id)->withTrashed()->exists()) {
                $slug .= '-'.Str::random(6);
            }

            $data['slug'] = $slug;
        }

        $catalogoepi->update($data);

        return redirect()
            ->route('catalogoepi.index')
            ->with('success', 'EPI atualizado com sucesso.');
    }

    public function destroy(Epi $catalogoepi): RedirectResponse
    {
        $catalogoepi->delete();

        return redirect()
            ->route('catalogoepi.index')
            ->with('success', 'EPI excluido com sucesso.');
    }
}



