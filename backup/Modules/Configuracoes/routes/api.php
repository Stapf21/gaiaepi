<?php

use Illuminate\Support\Facades\Route;
use Modules\Configuracoes\Http\Controllers\ConfiguracoesController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('configuracoes', ConfiguracoesController::class)->names('configuracoes');
});
