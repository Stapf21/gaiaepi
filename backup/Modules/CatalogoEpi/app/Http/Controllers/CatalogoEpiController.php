<?php

namespace Modules\CatalogoEpi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\CatalogoEpi\Http\Requests\StoreEpiRequest;
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
}
