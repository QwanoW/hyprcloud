<?php

use App\Http\Controllers\PageController;
use App\Models\Plan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $plans = Plan::with('features')->get();
    return Inertia::render('home/index', ['plans' => $plans]);
})->name('home');

Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');