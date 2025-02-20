<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\CategoryApi;

Route::group(['prefix' => 'categories'], function () {
    Route::get('list', [CategoryApi::class, 'list'])->name('api.restapi.categories.list');
});

