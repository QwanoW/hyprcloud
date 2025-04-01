<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
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
    Route::post('files/delete-permanently-multiple', [FileController::class, 'destroyPermanentlyMultiple'])->name('files.destroyPermanentlyMultiple');
    Route::post('files/restore-multiple', [FileController::class, 'restoreMultiple'])->name('files.restoreMultiple');
    Route::get('files/{filepath}', [FileController::class, 'show'])->where('filepath', '.*')->name('files.show');

    Route::controller(PlanController::class)->group(function () {
        Route::get('manage-plan', 'index')->name('manage-plan.index');
    });

    Route::controller(PaymentController::class)->group(function () {
        Route::get('/payment', 'index')->name('payment.index');
        Route::post('/mock-payment', 'processPayment');
        Route::get('mock-sbp-payment/{payment}', 'sbpPayment')->name('sbp.payment');
        Route::get('/mock-sbp-payment/{payment}/confirm', 'confirmSbpPayment')->name('sbp.payment.confirm');
        Route::get('/payment/success', 'success')->name('payment.success');
    });

    Route::prefix('dashboard')->group(function () {
        Route::get('/', [AppController::class, 'dashboard'])->name('dashboard');
        Route::get('gallery', [AppController::class, 'gallery'])->name('gallery');
        Route::get('trash', [AppController::class, 'trash'])->name('trash');
        Route::get('analytics', [AppController::class, 'analytics'])->name('analytics');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
