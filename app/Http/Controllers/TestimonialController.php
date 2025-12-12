<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function create()
    {
        return Inertia::render('home/testimonials/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'position_en' => 'required|string|max:255',
            'testimonial_en' => 'required|string',
            'photo' => 'nullable|image|max:1024',
        ]);

        $testimonial = new Testimonial();
        $testimonial->name_en = $validated['name_en'];
        $testimonial->position_en = $validated['position_en'];
        $testimonial->testimonial_en = $validated['testimonial_en'];
        $testimonial->name_ru = '';
        $testimonial->position_ru = '';
        $testimonial->testimonial_ru = '';
        $testimonial->show_on_homepage = false;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('testimonials', 'public');
            $testimonial->photo = $path;
        }

        $testimonial->save();

        return redirect()->back();
    }
}