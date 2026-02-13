<?php

use Illuminate\Support\Facades\Route;
use Modules\EntradasSaidas\Http\Controllers\EntradasSaidasController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('entradassaidas', EntradasSaidasController::class)->names('entradassaidas');
});
