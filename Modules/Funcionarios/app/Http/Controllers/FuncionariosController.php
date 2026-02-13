<?php

namespace Modules\Funcionarios\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Modules\EntradasSaidas\Repositories\LogisticsRepository;
use Modules\Funcionarios\Http\Requests\StoreEmployeeRequest;
use Modules\Funcionarios\Http\Requests\TerminateEmployeeRequest;
use Modules\Funcionarios\Models\Company;
use Modules\Funcionarios\Models\Department;
use Modules\Funcionarios\Models\Employee;
use Modules\Funcionarios\Models\Position;
use Modules\Funcionarios\Repositories\EmployeeRepository;
use Modules\Funcionarios\Services\EmployeeEquipmentReportService;

class FuncionariosController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $employees = EmployeeRepository::paginatedList(15, $search);

        return Inertia::render('Funcionarios/Index', [
            'stats' => EmployeeRepository::stats(),
            'employees' => $employees->through(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'status' => $employee->status,
                    'company' => $employee->company?->name,
                    'department' => $employee->department?->name,
                    'position' => $employee->position?->name,
                    'hire_date' => optional($employee->hire_date)->format('d/m/Y'),
                    'show_url' => route('funcionarios.show', $employee->id),
                    'edit_url' => route('funcionarios.edit', $employee->id),
                ];
            }),
            'pagination' => [
                'links' => $employees->linkCollection(),
                'prev' => $employees->previousPageUrl(),
                'next' => $employees->nextPageUrl(),
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Funcionarios/Create', $this->formPayload([
            'links' => [
                'cancel' => route('funcionarios.index'),
            ],
        ]));
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['address'] = array_filter($data['address'] ?? [], fn ($value) => $value !== null && $value !== '');
        $data['metadata'] = array_filter($data['metadata'] ?? [], fn ($value) => $value !== null && $value !== '');

        $employee = EmployeeRepository::create($data);

        return redirect()
            ->route('funcionarios.index')
            ->with('success', 'Funcionário criado com sucesso.');
    }

    public function edit(Employee $funcionario): Response
    {
        $employee = $funcionario->load(['company', 'department', 'position']);

        return Inertia::render('Funcionarios/Edit', $this->formPayload([
            'employee' => $this->transformEmployeeForForm($employee),
            'links' => [
                'cancel' => route('funcionarios.show', $employee->id),
            ],
        ]));
    }

    public function update(StoreEmployeeRequest $request, Employee $funcionario): RedirectResponse
    {
        $data = $request->validated();
        $data['address'] = array_filter($data['address'] ?? [], fn ($value) => $value !== null && $value !== '');
        $data['metadata'] = array_filter($data['metadata'] ?? [], fn ($value) => $value !== null && $value !== '');

        $originalDepartment = $funcionario->department_id;

        $employee = EmployeeRepository::update($funcionario, $data);

        $departmentChanged = $originalDepartment !== $employee->department_id;

        return redirect()
            ->route('funcionarios.show', $employee->id)
            ->with('success', 'Funcionário atualizado com sucesso.')
            ->with('prompt_kit', $departmentChanged);
    }

    public function show(Employee $funcionario): Response
    {
        $employee = $funcionario->load([
            'company',
            'department',
            'position',
        ]);

        $deliveries = LogisticsRepository::deliveriesForEmployee($employee->id);

        $history = $deliveries->map(function ($delivery) {
            return [
                'id' => $delivery->id,
                'code' => $delivery->code ?? sprintf('SA-%05d', $delivery->id),
                'status' => $delivery->status,
                'delivered_at' => optional($delivery->delivered_at)->format('d/m/Y'),
                'expected_return_at' => optional($delivery->expected_return_at)->format('d/m/Y'),
                'returned_at' => optional($delivery->returned_at)->format('d/m/Y'),
                'notes' => $delivery->notes,
                'items' => $delivery->items->map(fn ($item) => [
                    'id' => $item->id,
                    'epi' => $item->epi?->name,
                    'quantity' => (int) $item->quantity,
                ])->values(),
                'logs' => $delivery->logs->map(fn ($log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'notes' => $log->notes,
                    'created_at' => optional($log->created_at)->format('d/m/Y H:i'),
                ])->values(),
                'show_url' => route('entradassaidas.show', $delivery->id),
            ];
        })->values();

        $openDeliveries = $deliveries->whereNull('returned_at');
        $activeItems = $openDeliveries->sum(fn ($delivery) => $delivery->items->sum('quantity'));

        $historyStats = [
            'total' => $deliveries->count(),
            'open' => $openDeliveries->count(),
            'active_items' => (int) $activeItems,
            'last_delivery_at' => optional($deliveries->first()?->delivered_at)->format('d/m/Y'),
        ];

        $latestReport = $employee->terminationReports()
            ->latest()
            ->with('terminatedByUser:id,name')
            ->first();

        $latestReportPayload = $latestReport ? [
            'id' => $latestReport->id,
            'terminated_at' => optional($latestReport->terminated_at)->format('d/m/Y'),
            'by' => $latestReport->terminatedByUser?->name,
            'summary' => $latestReport->report['summary'] ?? [],
            'pending_items' => $latestReport->report['pending_items'] ?? [],
            'delivered_items' => $latestReport->report['delivered_items'] ?? [],
            'notes' => $latestReport->notes,
        ] : null;

        return Inertia::render('Funcionarios/Show', [
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'registration_number' => $employee->registration_number,
                'status' => $employee->status,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'mobile_phone' => $employee->mobile_phone,
                'company' => $employee->company?->name,
                'department' => $employee->department?->name,
                'department_id' => $employee->department_id,
                'position' => $employee->position?->name,
                'hire_date' => optional($employee->hire_date)->format('d/m/Y'),
                'termination_date' => optional($employee->termination_date)->format('d/m/Y'),
            ],
            'history' => [
                'stats' => $historyStats,
                'deliveries' => $history,
                'latest_termination' => $latestReportPayload,
            ],
            'links' => [
                'back' => route('funcionarios.index'),
                'edit' => route('funcionarios.edit', $employee->id),
                'new_delivery' => route('entradassaidas.create', ['employee' => $employee->id]),
                'apply_kit' => route('entradassaidas.create', [
                    'employee' => $employee->id,
                    'kit_prompt' => true,
                ]),
            ],
            'prompts' => [
                'kit' => (bool) session('prompt_kit'),
            ],
            'can' => [
                'delete' => $this->canManageEmployees(),
            ],
        ]);
    }

    public function destroy(Request $request, Employee $funcionario): RedirectResponse
    {
        if (! $request->user()?->can('manage_employees')) {
            abort(403);
        }

        $funcionario->delete();

        return redirect()
            ->route('funcionarios.index')
            ->with('success', 'Funcionário excluído com sucesso.');
    }
    public function terminate(
        TerminateEmployeeRequest $request,
        Employee $funcionario,
        EmployeeEquipmentReportService $reportService
    ): RedirectResponse {
        $data = $request->validated();
        $employee = EmployeeRepository::terminate($funcionario, $data);

        $reportData = $reportService->build($employee->load(['company', 'department', 'position']));

        $report = $employee->terminationReports()->create([
            'terminated_by' => Auth::id(),
            'terminated_at' => $data['termination_date'],
            'report' => $reportData,
            'delivered_items_count' => (int) ($reportData['summary']['total_items'] ?? 0),
            'pending_items_count' => (int) ($reportData['summary']['pending_items'] ?? 0),
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()
            ->route('funcionarios.show', $employee->id)
            ->with('success', 'Colaborador desligado e relatório gerado.')
            ->with('termination_report_id', $report->id);
    }
    protected function canManageEmployees(): bool
    {
        return auth()->user()?->can('manage_employees') ?? false;
    }
    protected function formPayload(array $extra = []): array
    {
        return array_merge([
            'companies' => Company::query()->select('id', 'name')->orderBy('name')->get(),
            'departments' => Department::query()->select('id', 'name', 'company_id')->orderBy('name')->get(),
            'positions' => Position::query()->select('id', 'name', 'company_id', 'department_id')->orderBy('name')->get(),
            'statuses' => collect(['ativo', 'afastado', 'desligado'])->map(fn ($status) => [
                'value' => $status,
                'label' => ucfirst(str_replace('_', ' ', $status)),
            ])->values(),
        ], $extra);
    }

    protected function transformEmployeeForForm(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'company_id' => $employee->company_id,
            'department_id' => $employee->department_id,
            'position_id' => $employee->position_id,
            'name' => $employee->name,
            'email' => $employee->email,
            'registration_number' => $employee->registration_number,
            'cpf' => $employee->cpf,
            'rg' => $employee->rg,
            'status' => $employee->status,
            'birth_date' => optional($employee->birth_date)->toDateString(),
            'hire_date' => optional($employee->hire_date)->toDateString(),
            'termination_date' => optional($employee->termination_date)->toDateString(),
            'phone' => $employee->phone,
            'mobile_phone' => $employee->mobile_phone,
            'work_shift' => $employee->work_shift,
            'address' => $employee->address ?? [],
            'metadata' => $employee->metadata ?? [],
            'update_url' => route('funcionarios.update', $employee->id),
        ];
    }
}

