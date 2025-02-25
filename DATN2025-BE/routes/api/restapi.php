<?php
use App\Http\Controllers\restapi\AttributeApi;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\CategoryApi;

Route::group(['prefix' => 'categories'], function () {
    Route::get('list', [CategoryApi::class, 'list'])->name('api.restapi.categories.list');
});

Route::group(['prefix' => 'attributes'], function () {
    Route::get('list', [AttributeApi::class, 'list'])->name('api.restapi.attributes.list');
});

