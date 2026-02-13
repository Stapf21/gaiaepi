<?php

namespace Modules\Configuracoes\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Configuracoes\Http\Requests\StoreUserRequest;
use Modules\Configuracoes\Http\Requests\UpdateUserRequest;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->with('roles:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->values(),
                ];
            });

        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get()
            ->map(function (Role $role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->pluck('name')->values(),
                ];
            });

        $permissions = Permission::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(function (Permission $permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'label' => ucfirst(str_replace('_', ' ', $permission->name)),
                ];
            });

        return Inertia::render('Configuracoes/Usuarios/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $user->syncRoles($data['roles'] ?? []);

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Usuario criado com sucesso.');
    }

    public function update(UpdateUserRequest $request, User $usuario): RedirectResponse
    {
        $data = $request->validated();

        $usuario->name = $data['name'];
        $usuario->email = $data['email'];

        if (!empty($data['password'])) {
            $usuario->password = $data['password'];
        }

        $usuario->save();
        $usuario->syncRoles($data['roles'] ?? []);

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Usuario atualizado com sucesso.');
    }

    public function destroy(User $usuario): RedirectResponse
    {
        if (auth()->id() === $usuario->id) {
            return redirect()
                ->route('configuracoes.usuarios.index')
                ->with('error', 'Voce nao pode excluir o proprio usuario.');
        }

        $usuario->delete();

        return redirect()
            ->route('configuracoes.usuarios.index')
            ->with('success', 'Usuario excluido com sucesso.');
    }
}
