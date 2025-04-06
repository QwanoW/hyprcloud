<?php

use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::get('/testimonials/create', [TestimonialController::class, 'create'])->name('testimonials.create');
Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');