<?php

use Illuminate\Support\Facades\Route;
use Modules\TreinamentosExames\Http\Controllers\TreinamentosExamesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('treinamentosexames', TreinamentosExamesController::class)->names('treinamentosexames');
});
