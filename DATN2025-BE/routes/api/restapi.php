<?php
use App\Http\Controllers\restapi\AttributeApi;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\CategoryApi;
use App\Http\Controllers\restapi\ProductApi;
use App\Http\Controllers\restapi\PropertyApi;

Route::group(['prefix' => 'categories'], function () {
    Route::get('list', [CategoryApi::class, 'list'])->name('api.restapi.categories.list');
});

Route::group(['prefix' => 'products'], function () {
    Route::get('list', [ProductApi::class, 'list'])->name('api.restapi.products.list');
    Route::get('detail/{id}', [ProductApi::class, 'detail'])->name('api.restapi.products.detail');
    Route::get('search', [ProductApi::class, 'search'])->name('api.restapi.products.search');
    Route::get('get-info', [ProductApi::class, 'getInfo'])->name('api.restapi.products.getInfo');
});

Route::group(['prefix' => 'attributes'], function () {
    Route::get('list', [AttributeApi::class, 'list'])->name('api.restapi.attributes.list');
});

Route::group(['prefix' => 'properties'], function () {
    Route::get('list', [PropertyApi::class, 'list'])->name('api.restapi.properties.list');
    Route::get('detail/{id}', [PropertyApi::class, 'detail'])->name('api.restapi.properties.detail');
});
