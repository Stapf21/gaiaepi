<?php

namespace Modules\EntradasSaidas\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Modules\CatalogoEpi\Models\Epi;
use Modules\EntradasSaidas\Http\Requests\StoreMovementRequest;
use Modules\EntradasSaidas\Http\Requests\StoreSignatureRequest;
use Modules\EntradasSaidas\Models\EpiDelivery;
use Modules\EntradasSaidas\Repositories\LogisticsRepository;
use Modules\Funcionarios\Models\Department;
use Modules\Funcionarios\Models\Employee;
use Modules\Funcionarios\Repositories\DepartmentEpiRepository;

class EntradasSaidasController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('EntradasSaidas/Index', [
            'stats' => LogisticsRepository::stats(),
            'deliveries' => LogisticsRepository::deliveries()->through(function ($delivery) {
                $documents = collect($delivery->documents)
                    ->sortByDesc('version')
                    ->values()
                    ->map(function ($document) use ($delivery) {
                        return [
                            'id' => $document->id,
                            'type' => $document->type,
                            'version' => $document->version,
                            'label' => $document->type === 'signed' ? 'Assinado' : 'Gerado',
                            'url' => route('entradassaidas.documents.show', [$delivery->id, $document->id]),
                            'update_url' => route('entradassaidas.documents.update', [$delivery->id, $document->id]),
                            'delete_url' => $document->type !== 'generated'
                                ? route('entradassaidas.documents.destroy', [$delivery->id, $document->id])
                                : null,
                            'created_at' => optional($document->created_at)->format('d/m/Y H:i'),
                        ];
                    });

                $preferredDocument = $documents->firstWhere('type', 'signed') ?? $documents->firstWhere('type', 'generated');

                return [
                    'id' => $delivery->id,
                    'code' => $delivery->code ?? sprintf('SA-%05d', $delivery->id),
                    'employee' => $delivery->employee?->name,
                    'show_url' => route('entradassaidas.show', $delivery->id),
                    'edit_url' => route('entradassaidas.edit', $delivery->id),
                    'destroy_url' => route('entradassaidas.destroy', $delivery->id),
                    'items' => $delivery->items->map(fn ($item) => [
                        'id' => $item->id,
                        'name' => $item->epi?->name,
                        'quantity' => $item->quantity,
                    ])->values(),
                    'delivered_at' => optional($delivery->delivered_at)->format('d/m/Y'),
                    'expected_return_at' => optional($delivery->expected_return_at)->format('d/m/Y'),
                    'status' => $delivery->status,
                    'document' => $preferredDocument,
                    'documents' => $documents,
                ];
            }),
        ]);
    }

    public function create(Request $request): Response
    {
        return $this->formResponse(null, $request);
    }

    public function edit(EpiDelivery $entradassaida, Request $request): Response
    {
        $delivery = $entradassaida->load(['items.epi']);

        return $this->formResponse($delivery, $request);
    }

    protected function formResponse(?EpiDelivery $delivery = null, ?Request $request = null): Response
    {
        $request ??= request();

        $component = $delivery ? 'EntradasSaidas/Edit' : 'EntradasSaidas/Create';
        $departmentKits = DepartmentEpiRepository::kits();
        $departmentHasKit = $departmentKits->pluck('department_id')->all();
        $stockPositions = LogisticsRepository::stockPositions();

        return Inertia::render($component, [
            'mode' => $delivery ? 'edit' : 'create',
            'epis' => Epi::query()->select('id', 'name')->orderBy('name')->get(),
            'employees' => Employee::query()
                ->select('id', 'name', 'department_id')
                ->with('department:id,name')
                ->orderBy('name')
                ->get()
                ->map(fn (Employee $employee) => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'department_id' => $employee->department_id,
                    'department' => $employee->department?->name,
                ]),
            'departments' => Department::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(fn (Department $department) => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'has_kit' => in_array($department->id, $departmentHasKit, true),
                ]),
            'statuses' => collect(LogisticsRepository::deliveryStatuses())->map(fn ($status) => [
                'value' => $status,
                'label' => ucfirst(str_replace('_', ' ', $status)),
            ])->values(),
            'departmentKits' => $departmentKits,
            'kitStock' => $stockPositions->map(fn ($item) => [
                'id' => $item['id'],
                'name' => $item['name'],
                'available' => $item['available'],
            ]),
            'prefill' => [
                'employee_id' => $request?->integer('employee'),
                'kit_prompt' => $request?->boolean('kit_prompt'),
                'department_id' => $request?->integer('department'),
            ],
            'delivery' => $delivery ? [
                'id' => $delivery->id,
                'code' => $delivery->code,
                'employee_id' => $delivery->employee_id,
                'status' => $delivery->status,
                'notes' => $delivery->notes,
                'delivered_at' => optional($delivery->delivered_at)->toDateString(),
                'expected_return_at' => optional($delivery->expected_return_at)->toDateString(),
                'items' => $delivery->items->map(fn ($item) => [
                    'id' => $item->id,
                    'epi_id' => $item->epi_id,
                    'epi' => $item->epi?->name,
                    'quantity' => $item->quantity,
                    'notes' => $item->notes,
                ])->values(),
                'update_url' => route('entradassaidas.update', $delivery->id),
                'destroy_url' => route('entradassaidas.destroy', $delivery->id),
            ] : null,
        ]);
    }

    public function show(EpiDelivery $entradassaida): Response
    {
        $delivery = $entradassaida->load([
            'employee',
            'employee.position',
            'employee.department',
            'items.epi',
            'documents' => fn ($query) => $query->orderByDesc('version'),
            'signatureCollector',
        ]);

        $documents = $delivery->documents->map(function ($document) use ($delivery) {
            return [
                'id' => $document->id,
                'type' => $document->type,
                'version' => $document->version,
                'label' => $document->type === 'signed' ? 'Assinado' : 'Gerado',
                'url' => route('entradassaidas.documents.show', [$delivery->id, $document->id]),
                'update_url' => route('entradassaidas.documents.update', [$delivery->id, $document->id]),
                'delete_url' => $document->type !== 'generated'
                    ? route('entradassaidas.documents.destroy', [$delivery->id, $document->id])
                    : null,
                'original_name' => $document->original_name,
                'created_at' => optional($document->created_at)->format('d/m/Y H:i'),
                'signed_by' => $document->signed_by,
                'generated_by' => $document->generated_by,
                'can_delete' => $document->type !== 'generated',
            ];
        })->values();

        $preferredDocument = $documents->firstWhere('type', 'signed') ?? $documents->firstWhere('type', 'generated');

        return Inertia::render('EntradasSaidas/Show', [
            'delivery' => [
                'id' => $delivery->id,
                'code' => $delivery->code ?? sprintf('SA-%05d', $delivery->id),
                'employee' => [
                    'name' => $delivery->employee?->name,
                    'position' => $delivery->employee?->position?->name,
                    'department' => $delivery->employee?->department?->name,
                ],
                'delivered_at' => optional($delivery->delivered_at)->format('d/m/Y'),
                'expected_return_at' => optional($delivery->expected_return_at)->format('d/m/Y'),
                'status' => $delivery->status,
                'notes' => $delivery->notes,
                'items' => $delivery->items->map(fn ($item) => [
                    'id' => $item->id,
                    'epi' => $item->epi?->name,
                    'epi_id' => $item->epi_id,
                    'quantity' => $item->quantity,
                    'notes' => $item->notes,
                    'delivered_at' => optional($item->delivered_at)->format('d/m/Y'),
                    'expected_return_at' => optional($item->expected_return_at)->format('d/m/Y'),
                ])->values(),
                'edit_url' => route('entradassaidas.edit', $delivery->id),
                'destroy_url' => route('entradassaidas.destroy', $delivery->id),
                'signature' => [
                    'url' => $delivery->signature_path ? Storage::url($delivery->signature_path) : null,
                    'signed_at' => optional($delivery->signature_signed_at)->format('d/m/Y H:i'),
                    'signed_by' => $delivery->signature_signed_name,
                    'collected_by' => $delivery->signatureCollector?->name,
                    'store_url' => route('entradassaidas.signatures.store', $delivery->id),
                ],
            ],
            'documents' => $documents,
            'document' => $preferredDocument,
        ]);
    }

    public function storeSignature(StoreSignatureRequest $request, EpiDelivery $entradassaida): RedirectResponse
    {
        $data = $request->validated();
        $delivery = $entradassaida->load('employee');

        $disk = Storage::disk('public');

        if (!str_contains($data['signature'], ',')) {
            return redirect()
                ->back()
                ->withErrors(['signature' => 'Assinatura inválida.'])
                ->withInput();
        }

        [$meta, $encoded] = explode(',', $data['signature'], 2);
        $binary = base64_decode($encoded, true);

        if ($binary === false) {
            return redirect()
                ->back()
                ->withErrors(['signature' => 'Não foi possível processar a assinatura.'])
                ->withInput();
        }

        if ($delivery->signature_path && $disk->exists($delivery->signature_path)) {
            $disk->delete($delivery->signature_path);
        }

        $filename = 'signatures/'.Str::uuid()->toString().'.png';
        $disk->put($filename, $binary);

        $delivery->update([
            'signature_path' => $filename,
            'signature_signed_name' => $data['signed_by_name'] ?: $delivery->employee?->name,
            'signature_signed_at' => now(),
            'signature_collected_by' => Auth::id(),
            'signature_metadata' => [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ],
        ]);

        return redirect()
            ->route('entradassaidas.show', $delivery->id)
            ->with('success', 'Assinatura registrada com sucesso.');
    }

    public function store(StoreMovementRequest $request): RedirectResponse
    {
        $payload = $this->normalizePayload($request->validated());

        LogisticsRepository::createDelivery($payload);

        return redirect()
            ->route('entradassaidas.index')
            ->with('success', 'Saida registrada com sucesso.');
    }

    public function update(StoreMovementRequest $request, EpiDelivery $entradassaida): RedirectResponse
    {
        $payload = $this->normalizePayload($request->validated());

        LogisticsRepository::updateDelivery($entradassaida, $payload);

        return redirect()
            ->route('entradassaidas.show', $entradassaida->id)
            ->with('success', 'Movimentacao atualizada com sucesso.');
    }

    public function destroy(EpiDelivery $entradassaida): RedirectResponse
    {
        LogisticsRepository::deleteDelivery($entradassaida);

        return redirect()
            ->route('entradassaidas.index')
            ->with('success', 'Movimentacao excluida com sucesso.');
    }

    protected function normalizePayload(array $validated): array
    {
        $items = collect($validated['items'] ?? [])->map(function (array $item) {
            return [
                'epi_id' => (int) $item['epi_id'],
                'quantity' => isset($item['quantity']) ? (int) $item['quantity'] : 1,
                'notes' => ($item['notes'] ?? null) !== '' ? $item['notes'] : null,
                'delivered_at' => $item['delivered_at'] ?? null,
                'expected_return_at' => $item['expected_return_at'] ?? null,
            ];
        })->values()->toArray();

        $payload = [
            'code' => $validated['code'] ?? null,
            'employee_id' => (int) $validated['employee_id'],
            'delivered_at' => $validated['delivered_at'],
            'expected_return_at' => $validated['expected_return_at'] ?? null,
            'status' => $validated['status'],
            'notes' => ($validated['notes'] ?? null) !== '' ? $validated['notes'] : null,
            'items' => $items,
        ];

        if (empty($payload['items']) && isset($validated['epi_id'])) {
            $payload['epi_id'] = (int) $validated['epi_id'];
            $payload['quantity'] = isset($validated['quantity']) ? (int) $validated['quantity'] : 1;
        }

        return $payload;
    }
}
