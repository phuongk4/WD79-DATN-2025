<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\restapi\AuthApi;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', function () {
    return view('index');
});

Route::group(['prefix' => 'auth'], function () {
    Route::post('/login', [AuthApi::class, 'login'])->name('auth.login');
    Route::post('/register', [AuthApi::class, 'register'])->name('auth.register');
    Route::get('/logout', [AuthApi::class, 'logout'])->name('auth.logout');
    Route::post('/forgot_password', [AuthApi::class, 'forgotPassword'])->name('auth.forgot.password');
    Route::post('/change_password', [AuthApi::class, 'changePassword'])->name('auth.change.password');
});

/* Restapi api */
Route::group(['prefix' => 'api'], function () {
    require_once __DIR__ . '/api/restapi.php';
});

/* Auth api */
Route::group(['prefix' => 'api', 'middleware' => ['auth.api']], function () {
    require_once __DIR__ . '/api/auth.php';
});

/* Admin api */
Route::group(['prefix' => 'api/admin', 'middleware' => ['admin.api']], function () {
    require_once __DIR__ . '/api/admin.php';
});
