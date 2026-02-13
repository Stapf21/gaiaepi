<?php

use Illuminate\Support\Facades\Route;
use Modules\TreinamentosExames\Http\Controllers\TreinamentosExamesController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('treinamentosexames', TreinamentosExamesController::class)->names('treinamentosexames');
});
