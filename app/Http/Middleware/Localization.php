<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Session
        if (session()->has('locale')) {
            App::setLocale(session('locale'));
        }
        // 2. Fallback to browser preference
        else {
            $locale = substr($request->getPreferredLanguage(config('app.available_locales')), 0, 2);
            App::setLocale($locale);
        }

        return $next($request);
    }
}
