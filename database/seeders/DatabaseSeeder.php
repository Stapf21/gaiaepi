<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Configuracoes\Database\Seeders\ConfiguracoesDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ConfiguracoesDatabaseSeeder::class,
        ]);

        if (! User::where('email', 'admin@epi.local')->exists()) {
            $admin = User::create([
                'name' => 'Administrador',
                'email' => 'admin@epi.local',
                'password' => Hash::make('Senha@123'),
                'email_verified_at' => now(),
            ]);

            $admin->assignRole('admin');
        }
    }
}
