<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/login', function () {
    return inertia('login');
})->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.post');
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/lang/{locale}', [LanguageController::class, 'switch'])->name('lang.switch');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index')->middleware('can:read roles');
        Route::post('/', [RoleController::class, 'store'])->name('store')->middleware('can:create roles');
        Route::match(['put', 'patch'], '/{role}', [RoleController::class, 'update'])->name('update')->middleware('can:update roles');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy')->middleware('can:delete roles');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index')->middleware('can:read users');
        Route::post('/', [UserController::class, 'store'])->name('store')->middleware('can:create users');
        Route::match(['put', 'patch'], '/{user}', [UserController::class, 'update'])->name('update')->middleware('can:update users');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy')->middleware('can:delete users');
        Route::put('{user}/password', [UserController::class, 'updatePassword'])
            ->name('users.password.update')->middleware('can:update users');
    });
});