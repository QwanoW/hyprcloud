<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VacancyController extends Controller
{
    /**
     * Отображает список всех активных вакансий
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $vacancies = Vacancy::active()->get();
        
        return Inertia::render('career/index', [
            'vacancies' => $vacancies
        ]);
    }

    /**
     * Отображает детальную информацию о вакансии
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $vacancy = Vacancy::findOrFail($id);
        
        return Inertia::render('career/show', [
            'vacancy' => $vacancy
        ]);
    }
}