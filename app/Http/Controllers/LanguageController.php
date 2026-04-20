<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function switch(Request $request, string $locale)
    {
        $supported = ['en', 'id'];

        if (!in_array($locale, $supported)) {
            abort(400, 'Unsupported locale');
        }

        session(['locale' => $locale]);

        return redirect()->back();
    }
}