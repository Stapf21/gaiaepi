<?php

use Illuminate\Support\Facades\Route;
use Modules\AcidentesRelatorios\Http\Controllers\AcidentesRelatoriosController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('acidentesrelatorios', AcidentesRelatoriosController::class)->names('acidentesrelatorios');
});
