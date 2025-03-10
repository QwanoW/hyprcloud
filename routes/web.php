<?php

use App\Models\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('files', \App\Http\Controllers\FileController::class)->except([
        'show',
        'index',
    ]);

    Route::get('dashboard', [\App\Http\Controllers\FileController::class, 'index'])->name('dashboard');

    Route::get('analytics', function () {
        return Inertia::render('analytics');
    })->name('analytics');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
