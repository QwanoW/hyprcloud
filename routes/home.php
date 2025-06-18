<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\VacancyController;
use App\Models\Plan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $plans = Plan::with('features')->get();
    $testimonials = \App\Models\Testimonial::where('show_on_homepage', true)->get();
    return Inertia::render('home/index', [
        'plans' => $plans,
        'testimonials' => $testimonials
    ]);
})->name('home');

Route::get('/pages/{slug}', [PageController::class, 'show'])->name('pages.show');

// Маршруты для страниц вакансий
Route::get('/career', [VacancyController::class, 'index'])->name('career.index');
Route::get('/career/{id}', [VacancyController::class, 'show'])->name('career.show');

// Маршруты для дополнительных страниц
Route::get('/docs', function () {
    return Inertia::render('home/docs');
})->name('docs');

Route::get('/blog', function () {
    return Inertia::render('home/blog');
})->name('blog');

Route::get('/support-center', function () {
    return Inertia::render('home/support-center');
})->name('support-center');

Route::get('/status', function () {
    return Inertia::render('home/status');
})->name('status');