<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ThemePreferenceController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::put('/preferences/theme', ThemePreferenceController::class)->name('preferences.theme.update');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
