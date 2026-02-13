<?php

use Illuminate\Support\Facades\Route;
use Modules\Funcionarios\Http\Controllers\FuncionariosController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('funcionarios', FuncionariosController::class)->names('funcionarios');
    Route::post('funcionarios/{funcionario}/terminate', [FuncionariosController::class, 'terminate'])
        ->name('funcionarios.terminate');
});
