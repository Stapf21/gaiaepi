<?php

use Illuminate\Support\Facades\Route;
use Modules\Configuracoes\Http\Controllers\ConfiguracoesController;
use Modules\Configuracoes\Http\Controllers\RoleController;
use Modules\Configuracoes\Http\Controllers\SystemUpdateController;
use Modules\Configuracoes\Http\Controllers\UserManagementController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('configuracoes', [ConfiguracoesController::class, 'index'])
        ->middleware('can:manage_settings')
        ->name('configuracoes.index');
    Route::post('configuracoes', [ConfiguracoesController::class, 'storeSettings'])
        ->middleware('can:manage_settings')
        ->name('configuracoes.store');
    Route::post('configuracoes/branding', [ConfiguracoesController::class, 'updateBranding'])
        ->middleware('can:manage_branding')
        ->name('configuracoes.branding.update');
    Route::get('configuracoes/atualizacoes', [SystemUpdateController::class, 'index'])
        ->middleware('can:manage_settings')
        ->name('configuracoes.atualizacoes.index');
    Route::post('configuracoes/atualizacoes/executar', [SystemUpdateController::class, 'run'])
        ->middleware('can:manage_settings')
        ->name('configuracoes.atualizacoes.run');

    Route::middleware('can:manage_users')->group(function () {
        Route::get('configuracoes/usuarios', [UserManagementController::class, 'index'])->name('configuracoes.usuarios.index');
        Route::post('configuracoes/usuarios', [UserManagementController::class, 'store'])->name('configuracoes.usuarios.store');
        Route::put('configuracoes/usuarios/{usuario}', [UserManagementController::class, 'update'])->name('configuracoes.usuarios.update');
        Route::delete('configuracoes/usuarios/{usuario}', [UserManagementController::class, 'destroy'])->name('configuracoes.usuarios.destroy');

        Route::post('configuracoes/roles', [RoleController::class, 'store'])->name('configuracoes.roles.store');
        Route::put('configuracoes/roles/{role}', [RoleController::class, 'update'])->name('configuracoes.roles.update');
        Route::delete('configuracoes/roles/{role}', [RoleController::class, 'destroy'])->name('configuracoes.roles.destroy');
    });

    Route::post('configuracoes/companies', [ConfiguracoesController::class, 'storeCompany'])->name('configuracoes.companies.store');
    Route::put('configuracoes/companies/{company}', [ConfiguracoesController::class, 'updateCompany'])->name('configuracoes.companies.update');
    Route::delete('configuracoes/companies/{company}', [ConfiguracoesController::class, 'destroyCompany'])->name('configuracoes.companies.destroy');

    Route::post('configuracoes/departments', [ConfiguracoesController::class, 'storeDepartment'])->name('configuracoes.departments.store');
    Route::put('configuracoes/departments/{department}', [ConfiguracoesController::class, 'updateDepartment'])->name('configuracoes.departments.update');
    Route::delete('configuracoes/departments/{department}', [ConfiguracoesController::class, 'destroyDepartment'])->name('configuracoes.departments.destroy');

    Route::post('configuracoes/positions', [ConfiguracoesController::class, 'storePosition'])->name('configuracoes.positions.store');
    Route::put('configuracoes/positions/{position}', [ConfiguracoesController::class, 'updatePosition'])->name('configuracoes.positions.update');
    Route::delete('configuracoes/positions/{position}', [ConfiguracoesController::class, 'destroyPosition'])->name('configuracoes.positions.destroy');

    Route::post('configuracoes/epi-categories', [ConfiguracoesController::class, 'storeEpiCategory'])->name('configuracoes.epi-categories.store');
    Route::put('configuracoes/epi-categories/{category}', [ConfiguracoesController::class, 'updateEpiCategory'])->name('configuracoes.epi-categories.update');
    Route::delete('configuracoes/epi-categories/{category}', [ConfiguracoesController::class, 'destroyEpiCategory'])->name('configuracoes.epi-categories.destroy');

    Route::prefix('administrativo/cadastros')->name('administrativo.cadastros.')->group(function () {
        Route::get('/', [ConfiguracoesController::class, 'administration'])
            ->name('index')
            ->defaults('section', 'companies');

        Route::get('/empresas', [ConfiguracoesController::class, 'administration'])
            ->name('empresas')
            ->defaults('section', 'companies');

        Route::get('/departamentos', [ConfiguracoesController::class, 'administration'])
            ->name('departamentos')
            ->defaults('section', 'departments');

        Route::get('/cargos', [ConfiguracoesController::class, 'administration'])
            ->name('cargos')
            ->defaults('section', 'positions');

        Route::get('/categorias-de-epi', [ConfiguracoesController::class, 'administration'])
            ->name('categorias')
            ->defaults('section', 'categories');
    });
});
