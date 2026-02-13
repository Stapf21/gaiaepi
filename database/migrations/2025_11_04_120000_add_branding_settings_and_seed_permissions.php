<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->ensureBrandingSettings();
        $this->ensurePermissionsAndRoles();
    }

    protected function ensureBrandingSettings(): void
    {
        if (!Schema::hasTable('system_settings')) {
            return;
        }

        $now = now();
        $settings = [
            [
                'group' => 'branding',
                'key' => 'branding.logo_path',
                'label' => 'Logo do sistema',
                'type' => 'string',
                'meta' => json_encode(['type' => 'file', 'accept' => 'image/*']),
            ],
            [
                'group' => 'branding',
                'key' => 'branding.favicon_path',
                'label' => 'Favicon',
                'type' => 'string',
                'meta' => json_encode(['type' => 'file', 'accept' => 'image/png,image/x-icon,image/svg+xml']),
            ],
            [
                'group' => 'branding',
                'key' => 'branding.login_background_path',
                'label' => 'Imagem de fundo do login',
                'type' => 'string',
                'meta' => json_encode(['type' => 'file', 'accept' => 'image/*']),
            ],
            [
                'group' => 'branding',
                'key' => 'branding.login_background_link',
                'label' => 'Link de fundo do login',
                'type' => 'string',
                'meta' => json_encode(['type' => 'url']),
            ],
        ];

        foreach ($settings as $setting) {
            $exists = DB::table('system_settings')->where('key', $setting['key'])->exists();

            if ($exists) {
                DB::table('system_settings')
                    ->where('key', $setting['key'])
                    ->update([
                        'group' => $setting['group'],
                        'label' => $setting['label'],
                        'type' => $setting['type'],
                        'meta' => $setting['meta'],
                        'updated_at' => $now,
                    ]);

                continue;
            }

            DB::table('system_settings')->insert([
                'group' => $setting['group'],
                'key' => $setting['key'],
                'label' => $setting['label'],
                'value' => null,
                'type' => $setting['type'],
                'meta' => $setting['meta'],
                'is_encrypted' => false,
                'created_by' => null,
                'updated_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    protected function ensurePermissionsAndRoles(): void
    {
        if (
            !class_exists(Permission::class) ||
            !class_exists(Role::class) ||
            !Schema::hasTable('permissions') ||
            !Schema::hasTable('roles')
        ) {
            return;
        }

        $permissions = [
            'view_dashboard',
            'manage_deliveries',
            'manage_employees',
            'manage_inventory',
            'manage_reports',
            'manage_training',
            'manage_catalog',
            'manage_settings',
            'manage_branding',
            'manage_users',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(
                ['name' => $permissionName, 'guard_name' => 'web']
            );
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);

        $allPermissions = Permission::whereIn('name', $permissions)->get();
        $adminRole->syncPermissions($allPermissions);

        $managerPermissions = Permission::whereIn('name', [
            'view_dashboard',
            'manage_deliveries',
            'manage_employees',
            'manage_inventory',
            'manage_reports',
            'manage_training',
            'manage_catalog',
        ])->get();
        $managerRole->syncPermissions($managerPermissions);

        $adminUser = DB::table('users')->where('id', 1)->first();
        if ($adminUser) {
            $userModel = \App\Models\User::find($adminUser->id);
            if ($userModel && !$userModel->hasRole('admin')) {
                $userModel->assignRole('admin');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank - we do not rollback seeded permissions or settings.
    }
};
