<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public const SUPPORTED_LOCALES = ['en', 'id'];

    public function switch(Request $request, string $locale)
    {
        if (!in_array($locale, self::SUPPORTED_LOCALES)) {
            abort(400, 'Unsupported locale');
        }

        session(['locale' => $locale]);

        return redirect()->back();
    }
}