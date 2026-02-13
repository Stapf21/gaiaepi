<?php

use Illuminate\Support\Facades\Route;
use Modules\CatalogoEpi\Http\Controllers\CatalogoEpiController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('catalogoepis', CatalogoEpiController::class)->names('catalogoepi');
});
