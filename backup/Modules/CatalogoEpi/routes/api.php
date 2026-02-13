<?php

use Illuminate\Support\Facades\Route;
use Modules\CatalogoEpi\Http\Controllers\CatalogoEpiController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('catalogoepis', CatalogoEpiController::class)->names('catalogoepi');
});
