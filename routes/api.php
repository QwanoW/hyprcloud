<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\VacancyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('api')->group(function() {
    // File management API endpoints
    Route::get('/files', [FileController::class, 'index'])->name('api.files.index');
    Route::post('/files', [FileController::class, 'store'])->name('api.files.store');
    Route::put('/files/{id}', [FileController::class, 'update'])->name('api.files.update');
    Route::delete('/files/{id}', [FileController::class, 'destroy'])->name('api.files.destroy');
    
    // Bulk operations
    Route::post('/files/bulk-delete', [FileController::class, 'destroyMultiple'])->name('api.files.bulk-delete');
    Route::post('/files/bulk-delete-permanently', [FileController::class, 'destroyPermanentlyMultiple'])->name('api.files.bulk-delete-permanently');
    Route::post('/files/bulk-restore', [FileController::class, 'restoreMultiple'])->name('api.files.bulk-restore');
    
    // Special operations
    Route::post('/files/download-zip', [FileController::class, 'downloadZip'])->name('api.files.download-zip');
    Route::post('/files/search', [FileController::class, 'search'])->name('api.files.search');
    
    // File variants (gallery, trash)
    Route::get('/files/gallery', [FileController::class, 'gallery'])->name('api.files.gallery');
    Route::get('/files/trash', [FileController::class, 'trash'])->name('api.files.trash');
});