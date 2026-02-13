<?php

use Illuminate\Support\Facades\Route;
use Modules\AcidentesRelatorios\Http\Controllers\AcidentesRelatoriosController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('acidentesrelatorios', AcidentesRelatoriosController::class)->names('acidentesrelatorios');
});
