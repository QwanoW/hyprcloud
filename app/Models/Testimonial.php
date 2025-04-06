<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ru',
        'position_en',
        'position_ru',
        'testimonial_en',
        'testimonial_ru',
        'photo',
        'show_on_homepage',
    ];

    protected $casts = [
        'show_on_homepage' => 'boolean',
    ];
}