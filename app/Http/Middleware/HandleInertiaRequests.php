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
}