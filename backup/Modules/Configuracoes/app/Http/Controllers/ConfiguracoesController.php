<?php

namespace Modules\Configuracoes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Modules\CatalogoEpi\Models\Epi;
use Modules\CatalogoEpi\Models\EpiCategory;
use Modules\Configuracoes\Http\Requests\StoreCompanyRequest;
use Modules\Configuracoes\Http\Requests\StoreDepartmentRequest;
use Modules\Configuracoes\Http\Requests\StoreEpiCategoryRequest;
use Modules\Configuracoes\Http\Requests\StorePositionRequest;
use Modules\Configuracoes\Http\Requests\UpdateBrandingRequest;
use Modules\Configuracoes\Models\SystemSetting;
use Modules\Configuracoes\Repositories\SystemSettingRepository;
use Modules\Funcionarios\Models\Company;
use Modules\Funcionarios\Models\Department;
use Modules\Funcionarios\Models\Position;
use Modules\Funcionarios\Repositories\DepartmentEpiRepository;

class ConfiguracoesController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Configuracoes/Index', [
            'groups' => SystemSettingRepository::listGrouped(),
            'branding' => SystemSettingRepository::branding(),
            'can' => [
                'manageBranding' => $request->user()?->can('manage_branding') ?? false,
            ],
        ]);
    }

    public function administration(Request $request): Response
    {
        $section = $request->route('section', 'companies');
        $section = in_array($section, ['companies', 'departments', 'positions', 'categories'], true)
            ? $section
            : 'companies';

        $component = match ($section) {
            'departments' => 'Administrativo/Departamentos',
            'positions' => 'Administrativo/Cargos',
            'categories' => 'Administrativo/Categorias',
            default => 'Administrativo/Empresas',
        };

        return Inertia::render($component, $this->administrationPayload($section));
    }

    public function storeSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array', 'min:1'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable', 'string'],
        ]);

        collect($validated['settings'])->each(function (array $setting) {
            $key = $setting['key'];
            $value = $setting['value'] ?? null;

            $existing = SystemSetting::query()->where('key', $key)->first();

            if ($existing) {
                $existing->update([
                    'value' => $value,
                    'updated_by' => Auth::id(),
                ]);
                SystemSettingRepository::forget($key);

                return;
            }

            $group = str_contains($key, '.') ? strstr($key, '.', true) : 'geral';

            SystemSetting::create([
                'group' => $group ?: 'geral',
                'key' => $key,
                'label' => ucfirst(str_replace('.', ' ', $key)),
                'value' => $value,
                'type' => 'string',
                'meta' => null,
                'is_encrypted' => false,
                'created_by' => Auth::id(),
            ]);

            SystemSettingRepository::forget($key);
        });

        return redirect()
            ->route('configuracoes.index')
            ->with('success', 'Configuracoes atualizadas.');
    }

    public function updateBranding(UpdateBrandingRequest $request): RedirectResponse
    {
        $disk = Storage::disk('public');
        $updates = [];

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('branding', 'public');
            $oldPath = SystemSettingRepository::getValue('branding.logo_path');
            if ($oldPath && $disk->exists($oldPath)) {
                $disk->delete($oldPath);
            }
            $updates['branding.logo_path'] = $path;
        }

        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('branding', 'public');
            $oldPath = SystemSettingRepository::getValue('branding.favicon_path');
            if ($oldPath && $disk->exists($oldPath)) {
                $disk->delete($oldPath);
            }
            $updates['branding.favicon_path'] = $path;
        }

        if ($request->boolean('clear_login_background')) {
            $oldBackgroundPath = SystemSettingRepository::getValue('branding.login_background_path');
            if ($oldBackgroundPath && $disk->exists($oldBackgroundPath)) {
                $disk->delete($oldBackgroundPath);
            }
            $updates['branding.login_background_path'] = null;
            $updates['branding.login_background_link'] = null;
        }

        if ($request->hasFile('login_background')) {
            $path = $request->file('login_background')->store('branding', 'public');
            $oldBackgroundPath = SystemSettingRepository::getValue('branding.login_background_path');
            if ($oldBackgroundPath && $disk->exists($oldBackgroundPath)) {
                $disk->delete($oldBackgroundPath);
            }
            $updates['branding.login_background_path'] = $path;
            $updates['branding.login_background_link'] = null;
        }

        if ($request->has('login_background_link')) {
            $link = trim((string) $request->input('login_background_link', ''));
            $normalizedLink = $link !== '' ? $link : null;
            $currentLink = SystemSettingRepository::getValue('branding.login_background_link');

            if ($normalizedLink !== $currentLink) {
                $updates['branding.login_background_link'] = $normalizedLink;
            }
        }

        if (empty($updates)) {
            return redirect()
                ->route('configuracoes.index')
                ->with('info', 'Nenhuma alteracao aplicada.');
        }

        $metadata = [
            'branding.logo_path' => [
                'label' => 'Logo do sistema',
                'meta' => ['type' => 'file', 'accept' => 'image/*'],
            ],
            'branding.favicon_path' => [
                'label' => 'Favicon',
                'meta' => ['type' => 'file', 'accept' => 'image/png,image/x-icon,image/svg+xml'],
            ],
            'branding.login_background_path' => [
                'label' => 'Imagem de fundo do login',
                'meta' => ['type' => 'file', 'accept' => 'image/*'],
            ],
            'branding.login_background_link' => [
                'label' => 'Link de fundo do login',
                'meta' => ['type' => 'url'],
            ],
        ];

        foreach ($updates as $key => $value) {
            $setting = SystemSetting::query()->firstOrNew(['key' => $key]);
            $setting->group = 'branding';
            $setting->label = $metadata[$key]['label'] ?? ucfirst(str_replace('.', ' ', $key));
            $setting->type = 'string';
            $setting->meta = $metadata[$key]['meta'] ?? null;
            $setting->value = $value;
            $setting->updated_by = Auth::id();
            if (!$setting->exists) {
                $setting->created_by = Auth::id();
            }
            $setting->save();

            SystemSettingRepository::forget($key);
        }

        return redirect()
            ->route('configuracoes.index')
            ->with('success', 'Identidade visual atualizada com sucesso.');
    }

    public function storeCompany(StoreCompanyRequest $request): RedirectResponse
    {
        Company::create($request->validated());

        return redirect()
            ->route('administrativo.cadastros.empresas')
            ->with('success', 'Empresa criada com sucesso.');
    }

    public function storeDepartment(StoreDepartmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $defaultItems = $data['default_epi_items'] ?? [];
        unset($data['default_epi_items']);

        $department = Department::create($data);

        DepartmentEpiRepository::syncItems($department, $defaultItems);

        return redirect()
            ->route('administrativo.cadastros.departamentos')
            ->with('success', 'Departamento criado com sucesso.');
    }

    public function storePosition(StorePositionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if (isset($data['epi_return_days']) && $data['epi_return_days'] !== null) {
            $data['epi_return_days'] = (int) $data['epi_return_days'];
        }

        Position::create($data);

        return redirect()
            ->route('administrativo.cadastros.cargos')
            ->with('success', 'Cargo criado com sucesso.');
    }

    public function storeEpiCategory(StoreEpiCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if (isset($data['default_return_days']) && $data['default_return_days'] !== null) {
            $data['default_return_days'] = (int) $data['default_return_days'];
        }

        EpiCategory::create($data);

        return redirect()
            ->route('administrativo.estoque.index')
            ->with('success', 'Categoria de EPI criada com sucesso.');
    }

    public function updateCompany(StoreCompanyRequest $request, Company $company): RedirectResponse
    {
        $company->update($request->validated());

        return redirect()
            ->route('administrativo.cadastros.empresas')
            ->with('success', 'Empresa atualizada com sucesso.');
    }

    public function destroyCompany(Company $company): RedirectResponse
    {
        $company->delete();

        return redirect()
            ->route('administrativo.cadastros.empresas')
            ->with('success', 'Empresa excluida com sucesso.');
    }

    public function updateDepartment(StoreDepartmentRequest $request, Department $department): RedirectResponse
    {
        $data = $request->validated();
        $defaultItems = $data['default_epi_items'] ?? [];
        unset($data['default_epi_items']);

        $department->update($data);

        DepartmentEpiRepository::syncItems($department, $defaultItems);

        return redirect()
            ->route('administrativo.cadastros.departamentos')
            ->with('success', 'Departamento atualizado com sucesso.');
    }

    public function destroyDepartment(Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()
            ->route('administrativo.cadastros.departamentos')
            ->with('success', 'Departamento excluido com sucesso.');
    }

    public function updatePosition(StorePositionRequest $request, Position $position): RedirectResponse
    {
        $data = $request->validated();

        if (isset($data['epi_return_days']) && $data['epi_return_days'] !== null) {
            $data['epi_return_days'] = (int) $data['epi_return_days'];
        }

        $position->update($data);

        return redirect()
            ->route('administrativo.cadastros.cargos')
            ->with('success', 'Cargo atualizado com sucesso.');
    }

    public function destroyPosition(Position $position): RedirectResponse
    {
        $position->delete();

        return redirect()
            ->route('administrativo.cadastros.cargos')
            ->with('success', 'Cargo excluido com sucesso.');
    }

    public function updateEpiCategory(StoreEpiCategoryRequest $request, EpiCategory $category): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        if (isset($data['default_return_days']) && $data['default_return_days'] !== null) {
            $data['default_return_days'] = (int) $data['default_return_days'];
        }

        $category->update($data);

        return redirect()
            ->route('administrativo.estoque.index')
            ->with('success', 'Categoria de EPI atualizada com sucesso.');
    }

    public function destroyEpiCategory(EpiCategory $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('administrativo.estoque.index')
            ->with('success', 'Categoria de EPI excluida com sucesso.');
    }

    protected function loadAdministrationData(): array
    {
        $companies = Company::query()
            ->orderBy('name')
            ->get(['id', 'name', 'legal_name', 'document', 'email', 'phone']);

        $departments = Department::query()
            ->with(['company:id,name', 'defaultEpiItems.epi:id,name'])
            ->orderBy('name')
            ->get(['id', 'company_id', 'name', 'code', 'description']);

        $positions = Position::query()
            ->with(['company:id,name', 'department:id,name'])
            ->orderBy('name')
            ->get(['id', 'company_id', 'department_id', 'name', 'code', 'epi_return_days', 'description']);

        $epiCategories = EpiCategory::query()
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'default_return_days']);

        $epis = Epi::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return [
            'companies' => $companies->map(fn (Company $company) => [
                'id' => $company->id,
                'name' => $company->name,
                'legal_name' => $company->legal_name,
                'document' => $company->document,
                'email' => $company->email,
                'phone' => $company->phone,
            ])->values(),
            'departments' => $departments->map(fn (Department $department) => [
                'id' => $department->id,
                'name' => $department->name,
                'code' => $department->code,
                'description' => $department->description,
                'company' => [
                    'id' => $department->company_id,
                    'name' => $department->company?->name,
                ],
                'default_epi_items' => $department->defaultEpiItems
                    ->map(fn ($item) => [
                        'id' => $item->id,
                        'epi_id' => $item->epi_id,
                        'epi' => $item->epi?->name,
                        'quantity' => (int) $item->quantity,
                        'notes' => $item->notes,
                    ])
                    ->values(),
            ])->values(),
            'positions' => $positions->map(fn (Position $position) => [
                'id' => $position->id,
                'name' => $position->name,
                'code' => $position->code,
                'epi_return_days' => $position->epi_return_days,
                'description' => $position->description,
                'company' => [
                    'id' => $position->company_id,
                    'name' => $position->company?->name,
                ],
                'department' => $position->department
                    ? ['id' => $position->department_id, 'name' => $position->department->name]
                    : null,
            ])->values(),
            'epiCategories' => $epiCategories->map(fn (EpiCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'default_return_days' => $category->default_return_days,
            ])->values(),
            'epis' => $epis->map(fn ($epi) => [
                'id' => $epi->id,
                'name' => $epi->name,
            ])->values(),
        ];
    }

    protected function administrationPayload(string $section): array
    {
        $data = $this->loadAdministrationData();

        return match ($section) {
            'departments' => [
                'departments' => $data['departments'],
                'companies' => $data['companies'],
                'epis' => $data['epis'],
            ],
            'positions' => [
                'positions' => $data['positions'],
                'companies' => $data['companies'],
                'departments' => $data['departments'],
            ],
            'categories' => [
                'epiCategories' => $data['epiCategories'],
            ],
            default => [
                'companies' => $data['companies'],
            ],
        };
    }
}
