<?php

namespace Modules\Configuracoes\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Modules\Configuracoes\Http\Requests\StoreRoleRequest;
use Modules\Configuracoes\Http\Requests\UpdateRoleRequest;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Perfil criado com sucesso.');
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();

        if ($role->name === 'admin' && $data['name'] !== 'admin') {
            return redirect()
                ->route('configuracoes.usuarios.index')
                ->with('error', 'Nao e possivel renomear o perfil administrativo.');
        }

        $role->name = $role->name === 'admin' ? 'admin' : $data['name'];
        $role->save();

        $role->syncPermissions($data['permissions'] ?? []);

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Perfil atualizado com sucesso.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['admin', 'manager'], true)) {
            return redirect()
                ->route('configuracoes.usuarios.index')
                ->with('error', 'Nao e possivel excluir perfis padrao do sistema.');
        }

        if ($role->users()->count() > 0) {
            return redirect()
                ->route('configuracoes.usuarios.index')
                ->with('error', 'Remova o perfil dos usuarios antes de excluir.');
        }

        $role->delete();

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Perfil excluido com sucesso.');
    }
}
