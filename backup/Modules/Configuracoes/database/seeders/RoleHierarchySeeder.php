<?php

namespace Modules\Configuracoes\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleHierarchySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guard = config('auth.defaults.guard', 'web');

        $permissions = [
            'view dashboard',
            'manage usuarios',
            'manage funcionarios',
            'manage cargos',
            'manage epis',
            'manage estoque',
            'manage treinamentos',
            'manage exames',
            'manage acidentes',
            'manage configuracoes',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => $guard]
            );
        }

        $roles = [
            'admin' => $permissions,
            'gerente' => [
                'view dashboard',
                'manage usuarios',
                'manage funcionarios',
                'manage cargos',
                'manage epis',
                'manage estoque',
                'manage treinamentos',
                'manage exames',
                'manage acidentes',
            ],
            'coordenador' => [
                'view dashboard',
                'manage funcionarios',
                'manage epis',
                'manage estoque',
                'manage treinamentos',
                'manage exames',
            ],
            'lider' => [
                'view dashboard',
                'manage epis',
                'manage estoque',
            ],
        ];

        foreach ($roles as $role => $perms) {
            /** @var \Spatie\Permission\Models\Role $roleModel */
            $roleModel = Role::firstOrCreate(
                ['name' => $role, 'guard_name' => $guard]
            );

            $roleModel->syncPermissions($perms);
        }

        DB::table('system_settings')->updateOrInsert(
            ['key' => 'alerts.epi_days_before_due'],
            [
                'group' => 'alerts',
                'label' => 'Dias para alertar vencimento de EPI',
                'value' => '7',
                'type' => 'integer',
            ]
        );

        DB::table('system_settings')->updateOrInsert(
            ['key' => 'alerts.training_days_before_due'],
            [
                'group' => 'alerts',
                'label' => 'Dias para alertar vencimento de treinamento',
                'value' => '15',
                'type' => 'integer',
            ]
        );
    }
}
