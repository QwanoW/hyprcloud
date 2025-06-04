<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    public function dashboard(Request $request) {
        return Inertia::render('dashboard/index');
    }

    public function gallery(Request $request) {
        return Inertia::render('dashboard/gallery/index');
    }

    public function trash(Request $request) {
        return Inertia::render('dashboard/trash/index');
    }

    public function analytics(Request $request) {
        return Inertia::render('dashboard/analytics/index');
    }

    public function usage()
    {
        $user = Auth::user();
        $payment = Payment::where('user_id', $user->id)->latest()->first();
        return Inertia::render('dashboard/usage/index', [
            'payment' => $payment,
        ]);
    }
}
