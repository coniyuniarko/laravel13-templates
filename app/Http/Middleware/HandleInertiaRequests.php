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
            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'avatar') ?? null,
                'roles' => $request->user()?->getRoleNames() ?? [],
                'permissions' => $request->user()?->getAllPermissions()->pluck('name') ?? [],
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'id' => uniqid(),
            ],
        ];
    }

    private function getTranslations(): array
    {
        $locale = app()->getLocale();
        $path = lang_path("{$locale}");

        if (!is_dir($path))
            return [];

        $translations = [];
        foreach (glob("{$path}/*.php") as $file) {
            $key = basename($file, '.php');
            $translations[$key] = require $file;
        }

        return $translations;
    }
}