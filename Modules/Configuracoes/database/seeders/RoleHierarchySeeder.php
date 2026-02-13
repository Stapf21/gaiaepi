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
            'view_dashboard',
            'manage_users',
            'manage_employees',
            'manage_positions',
            'manage_catalog',
            'manage_inventory',
            'manage_training',
            'manage_reports',
            'manage_settings',
            'manage_branding',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => $guard]
            );
        }

        $roles = [
            'admin' => $permissions,
            'manager' => [
                'view_dashboard',
                'manage_users',
                'manage_employees',
                'manage_positions',
                'manage_catalog',
                'manage_inventory',
                'manage_training',
                'manage_reports',
            ],
            'gerente' => [
                'view_dashboard',
                'manage_users',
                'manage_employees',
                'manage_positions',
                'manage_catalog',
                'manage_inventory',
                'manage_training',
                'manage_reports',
            ],
            'coordenador' => [
                'view_dashboard',
                'manage_employees',
                'manage_catalog',
                'manage_inventory',
                'manage_training',
            ],
            'lider' => [
                'view_dashboard',
                'manage_catalog',
                'manage_inventory',
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
