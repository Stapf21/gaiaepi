<?php

use Illuminate\Support\Facades\Route;
use Modules\EntradasSaidas\Http\Controllers\DeliveryDocumentController;
use Modules\EntradasSaidas\Http\Controllers\EntradasSaidasController;
use Modules\EntradasSaidas\Http\Controllers\InventoryController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('entradassaidas', EntradasSaidasController::class)->names('entradassaidas');

    Route::prefix('entradassaidas/{entradassaida}')->name('entradassaidas.')->group(function () {
        Route::get('documents/{document}', [DeliveryDocumentController::class, 'show'])->name('documents.show');
        Route::post('documents', [DeliveryDocumentController::class, 'store'])->name('documents.store');
        Route::put('documents/{document}', [DeliveryDocumentController::class, 'update'])->name('documents.update');
        Route::delete('documents/{document}', [DeliveryDocumentController::class, 'destroy'])->name('documents.destroy');
    });

    Route::prefix('administrativo/estoque')->name('administrativo.estoque.')->group(function () {
        Route::get('/', [InventoryController::class, 'index'])->name('index');
        Route::get('/entrada', [InventoryController::class, 'create'])->name('entrada.create');
        Route::post('/entrada', [InventoryController::class, 'store'])->name('entrada.store');
    });
});
