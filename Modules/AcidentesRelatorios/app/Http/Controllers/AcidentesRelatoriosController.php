<?php

namespace Modules\AcidentesRelatorios\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\AcidentesRelatorios\Http\Requests\StoreAccidentRequest;
use Modules\AcidentesRelatorios\Models\AccidentType;
use Modules\AcidentesRelatorios\Repositories\AccidentRepository;
use Modules\Funcionarios\Models\Employee;

class AcidentesRelatoriosController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('AcidentesRelatorios/Index', [
            'stats' => AccidentRepository::stats(),
            'accidents' => AccidentRepository::recent()->through(function ($accident) {
                return [
                    'id' => $accident->id,
                    'protocol' => $accident->protocol ?? sprintf('AC-%05d', $accident->id),
                    'type' => $accident->type?->name,
                    'occurred_at' => optional($accident->occurred_at)->format('d/m/Y'),
                    'severity' => $accident->severity,
                    'status' => $accident->status,
                ];
            }),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('AcidentesRelatorios/Create', [
            'types' => AccidentType::query()->select('id', 'name')->orderBy('name')->get(),
            'employees' => Employee::query()->select('id', 'name')->orderBy('name')->get(),
            'severityOptions' => AccidentRepository::severityOptions(),
            'statusOptions' => AccidentRepository::statusOptions(),
        ]);
    }

    public function store(StoreAccidentRequest $request): RedirectResponse
    {
        $data = collect($request->validated())->map(function ($value) {
            return $value === '' ? null : $value;
        })->toArray();

        AccidentRepository::create($data);

        return redirect()
            ->route('acidentesrelatorios.index')
            ->with('success', 'Registro de acidente criado com sucesso.');
    }
}
