<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\FileController;
use App\Models\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('files', \App\Http\Controllers\FileController::class)->except(['show', 'index']);
    Route::post('files/delete-multiple', [FileController::class, 'destroyMultiple'])->name('files.destroyMultiple');
    Route::post('files/trash-multiple', [FileController::class, 'trashMultiple'])->name('files.trashMultiple');
    Route::post('files/restore-multiple', [FileController::class, 'restoreMultiple'])->name('files.restoreMultiple');
    Route::get('files/{filepath}', [FileController::class, 'show'])->where('filepath', '.*')->name('files.show');


    Route::get('dashboard', [AppController::class, 'dashboard'])->name('dashboard');
    Route::get('gallery', [AppController::class, 'gallery'])->name('gallery');
    Route::get('trash', [AppController::class, 'trash'])->name('trash');
    Route::get('analytics', [AppController::class, 'analytics'])->name('analytics');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
