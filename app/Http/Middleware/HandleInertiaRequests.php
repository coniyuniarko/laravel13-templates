<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'locale' => app()->getLocale(),
            'translations' => $this->getTranslations(),
        ];
    }

    private function getTranslations(): array
    {
        $locale = app()->getLocale();
        $path = lang_path("{$locale}");

        if (!is_dir($path)) return [];

        $translations = [];
        foreach (glob("{$path}/*.php") as $file) {
            $key = basename($file, '.php');
            $translations[$key] = require $file;
        }

        return $translations;
    }
}