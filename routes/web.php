<?php

use App\Http\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('home');
});

Route::get('/login', function () {
    return inertia('login');
})->name('login');

Route::get('/lang/{locale}', [LanguageController::class, 'switch'])->name('lang.switch');