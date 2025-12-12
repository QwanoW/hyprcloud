<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Inertia\Inertia;

class VacancyController extends Controller
{
    public function index()
    {
        $vacancies = Vacancy::active()->get();
        
        return Inertia::render('home/career/index', [
            'vacancies' => $vacancies
        ]);
    }

    public function show($id)
    {
        $vacancy = Vacancy::findOrFail($id);
        
        return Inertia::render('home/career/show', [
            'vacancy' => $vacancy
        ]);
    }
}