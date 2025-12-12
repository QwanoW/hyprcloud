<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        
        return Inertia::render('home/show', [
            'page' => $page,
            'locale' => app()->getLocale()
        ]);
    }
}