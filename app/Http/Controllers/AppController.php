<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function dashboard(Request $request) {
        return redirect()->route('all-files');
    }
    public function files(Request $request) {
        return Inertia::render('dashboard/files/index');
    }

    public function gallery(Request $request) {
        return Inertia::render('dashboard/gallery/index');
    }

    public function trash(Request $request) {
        return Inertia::render('dashboard/trash/index');
    }

    public function shared(Request $request) {
        return Inertia::render('dashboard/shared/index');
    }

    public function usage()
    {
        $user = Auth::user();
        $payment = Payment::where('user_id', $user->id)->latest()->first();
        return Inertia::render('dashboard/usage/index', [
            'payment' => $payment,
        ]);
    }

    public function showFile(Request $request, string $fileId)
    {
        $user = Auth::user();
        
        // Decode the hashed file ID
        $decodedId = base64_decode($fileId);
        if (!is_numeric($decodedId)) {
            abort(404);
        }
        
        // Find the file and ensure it belongs to the current user
        $file = \App\Models\File::withTrashed()->where('id', $decodedId)
            ->where('user_id', $user->id)
            ->first();
            
        if (!$file) {
            abort(404);
        }
        
        // Build breadcrumb path by traversing up the folder hierarchy
        $breadcrumbPath = [];
        $currentParent = $file->parentFolder;
        
        while ($currentParent) {
            array_unshift($breadcrumbPath, $currentParent);
            $currentParent = $currentParent->parentFolder;
        }
        
        return Inertia::render('dashboard/files/show', [
            'fileId' => $fileId,
            'file' => new \App\Http\Resources\FileResource($file),
            'breadcrumbPath' => \App\Http\Resources\FileResource::collection($breadcrumbPath),
        ]);
    }
}
