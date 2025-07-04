<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SharedLinkController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes for shared files
Route::get('/shared/{token}', [SharedLinkController::class, 'accessPage'])->name('shared.access');
Route::post('/shared/{token}', [SharedLinkController::class, 'accessPage'])->name('shared.password');
Route::get('/shared/{token}/download', [SharedLinkController::class, 'download'])->name('shared.download');
Route::get('/shared/{token}/preview', [SharedLinkController::class, 'preview'])->name('shared.preview');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('files', FileController::class)->except(['show', 'index']);
    Route::post('files/delete-multiple', [FileController::class, 'destroyMultiple'])->name('files.destroyMultiple');
    Route::post('files/delete-permanently-multiple', [FileController::class, 'destroyPermanentlyMultiple'])->name('files.destroyPermanentlyMultiple');
    Route::post('files/restore-multiple', [FileController::class, 'restoreMultiple'])->name('files.restoreMultiple');

    // api routes
    Route::post('files/download-zip', [FileController::class, 'downloadZip'])->name('files.downloadZip');
    Route::post('files/search', [FileController::class, 'search'])->name('files.search');

    Route::controller(PlanController::class)->group(function () {
        Route::get('manage-plan', 'index')->name('manage-plan.index');
    });

    Route::controller(PaymentController::class)->group(function () {
        Route::get('/payment', 'index')->name('payment.index');
        Route::post('/mock-payment', 'processPayment');
        Route::get('/mock-sbp-payment/{payment}', 'sbpPayment')->name('sbp.payment');
        Route::get('/mock-sbp-payment/{payment}/confirm', 'confirmSbpPayment')->name('sbp.payment.confirm');
        Route::get('/payment/success', 'success')->name('payment.success');
    });

    Route::prefix('dashboard')->group(function () {
        Route::get('/', [AppController::class, 'dashboard'])->name('dashboard');
        Route::get('/files', [AppController::class, 'files'])->name('all-files');
        Route::get('/files/{fileId}', [AppController::class, 'showFile'])->name('files.showFile');
        Route::get('gallery', [AppController::class, 'gallery'])->name('gallery');
        Route::get('trash', [AppController::class, 'trash'])->name('trash');
        Route::get('shared', [AppController::class, 'shared'])->name('shared');
        Route::get('search', function () {
            return Inertia::render('dashboard/search/index');
        })->name('dashboard.search');
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');
        Route::get('usage', [AppController::class, 'usage'])->name('dashboard.usage');
        Route::get('help', function () {
            return Inertia::render('dashboard/help/index');
        })->name('dashboard.help');
        
        // Collections routes
        Route::get('collections', function () {
            return Inertia::render('dashboard/collections/index');
        })->name('dashboard.collections.index');
        Route::get('collections/{collection}', function ($collection) {
            return Inertia::render('dashboard/collections/show', ['collectionId' => $collection]);
        })->name('dashboard.collections.show');
        
        // Folders routes
        Route::get('folders/{folder}', function ($folder) {
            return Inertia::render('dashboard/folders/index', ['folderId' => $folder]);
        })->name('folders.show');
    });
});

Route::get('files/{filepath}', [FileController::class, 'show'])->where('filepath', '.*')->name('files.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/home.php';
require __DIR__ . '/testimonials.php';
require __DIR__ . '/api.php';
