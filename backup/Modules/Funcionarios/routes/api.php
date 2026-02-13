<?php

use Illuminate\Support\Facades\Route;
use Modules\Funcionarios\Http\Controllers\FuncionariosController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('funcionarios', FuncionariosController::class)->names('funcionarios');
});
