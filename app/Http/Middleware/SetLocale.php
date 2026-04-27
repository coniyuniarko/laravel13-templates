<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\LanguageController;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $supported = LanguageController::SUPPORTED_LOCALES;
        $header = $request->header('Accept-Language');

        if ($header && in_array($header, $supported)) {
            App::setLocale($header);
        } elseif ($request->hasSession() && session()->has('locale') && in_array(session('locale'), $supported)) {
            $locale = session('locale');
            App::setLocale($locale);
        } else {
            App::setLocale('en');
        }

        return $next($request);
    }
}