<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\VacancyController;
use App\Models\Plan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $plans = Plan::with('features')->get();
    return Inertia::render('home/index', ['plans' => $plans]);
})->name('home');

Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');

// Маршруты для страниц вакансий
Route::get('/career', [VacancyController::class, 'index'])->name('career.index');
Route::get('/career/{id}', [VacancyController::class, 'show'])->name('career.show');