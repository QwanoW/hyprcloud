<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'title_en', 'title_ru', 'content_en', 'content_ru', 'last_updated'];

    protected $casts = [
        'last_updated' => 'datetime',
    ];
}