<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;

class AppController extends Controller
{
    public function dashboard(Request $request) {
        $files = FileController::getPaginatedFiles();
        return Inertia::render('dashboard', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function gallery(Request $request) {
        $files = FileController::getPaginatedFiles(['image' => true]);
        return Inertia::render('gallery', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function trash(Request $request) {
        $files = FileController::getPaginatedFiles(['trash' => true]);
        return Inertia::render('trash', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function analytics(Request $request) {
        return Inertia::render('analytics');
    }
}
