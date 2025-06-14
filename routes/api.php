<?php

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\SharedLinkController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::middleware(['auth'])->prefix('api')->group(function() {
    // Unified file and folder management API endpoints
    Route::get('/file-manager', [FileManagerController::class, 'index'])->name('api.file-manager.index');
    Route::post('/file-manager/folders', [FileManagerController::class, 'createFolder'])->name('api.file-manager.create-folder');
    Route::get('/file-manager/tree', [FileManagerController::class, 'tree'])->name('api.file-manager.tree');
    Route::put('/file-manager/{id}/move', [FileManagerController::class, 'move'])->name('api.file-manager.move');
    Route::put('/file-manager/{id}/name', [FileManagerController::class, 'updateName'])->name('api.file-manager.update-name');
    Route::delete('/file-manager/{id}', [FileManagerController::class, 'destroy'])->name('api.file-manager.destroy');
    
    // File operations
    Route::post('/files', [FileController::class, 'store'])->name('api.files.store');
    Route::put('/files/{id}', [FileController::class, 'update'])->name('api.files.update');
    Route::delete('/files/{id}', [FileController::class, 'destroy'])->name('api.files.destroy');
    
    // Bulk operations
    Route::post('/files/bulk-delete', [FileController::class, 'destroyMultiple'])->name('api.files.bulk-delete');
    Route::post('/files/bulk-delete-permanently', [FileController::class, 'destroyPermanentlyMultiple'])->name('api.files.bulk-delete-permanently');
    Route::post('/files/bulk-restore', [FileController::class, 'restoreMultiple'])->name('api.files.bulk-restore');
    
    // Special operations
    Route::post('/files/download-zip', [FileController::class, 'downloadZip'])->name('api.files.download-zip');
    Route::get('/files/search', [FileController::class, 'search'])->name('api.files.search');
    
    // Collections API endpoints
    Route::apiResource('collections', CollectionController::class);
    Route::get('/collections-recent', [CollectionController::class, 'recent'])->name('api.collections.recent');
    
    // Shared links API endpoints
    Route::post('/shared-links', [SharedLinkController::class, 'create'])->name('api.shared-links.create');
    Route::put('/shared-links/{sharedLink}', [SharedLinkController::class, 'update'])->name('api.shared-links.update');
    Route::delete('/shared-links/{sharedLink}', [SharedLinkController::class, 'destroy'])->name('api.shared-links.destroy');
    Route::get('/files/{file}/shared-links', [SharedLinkController::class, 'getFileSharedLinks'])->name('api.files.shared-links');
    Route::get('/user/shared-links', [SharedLinkController::class, 'getUserSharedLinks'])->name('api.user.shared-links');
});

Route::post('/api/locale', function (Request $request) {
    $request->validate(['locale' => 'required|string']);
    
    if (in_array($request->locale, config('app.available_locales'))) {
        session(['locale' => $request->locale]);
        return response()->json(['message' => 'success']);
    }
    return response()->json(['message' => 'unknown language'], 400);
})->name('locale');