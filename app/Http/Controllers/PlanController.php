<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index() {
        $plans = Plan::with('features')->get();
        return Inertia::render('dashboard/manage-plan/index', [
            'plans' => $plans
        ]);
    }
}
