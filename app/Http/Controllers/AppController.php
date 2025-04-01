<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileCollection;
use App\Http\Resources\FileResource;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppController extends Controller
{
    public function dashboard(Request $request) {
        $files = FileController::getPaginatedFiles();
        return Inertia::render('dashboard/index', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function gallery(Request $request) {
        $files = FileController::getPaginatedFiles(['image' => true]);
        return Inertia::render('dashboard/gallery', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function trash(Request $request) {
        $files = FileController::getPaginatedFiles(['trash' => true]);
        return Inertia::render('dashboard/trash', [
            'files' => inertia()->merge(fn() => (new FileCollection($files))->collection),
            'pagination' => Arr::except($files->toArray(), ['data']),
        ]);
    }

    public function analytics(Request $request) {
        return Inertia::render('dashboard/analytics');
    }
}
