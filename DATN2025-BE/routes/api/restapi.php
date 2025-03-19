<?php
use App\Http\Controllers\restapi\AttributeApi;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\CategoryApi;
use App\Http\Controllers\restapi\CouponApi;
use App\Http\Controllers\restapi\ProductApi;
use App\Http\Controllers\restapi\PropertyApi;
use App\Http\Controllers\restapi\ReviewProductApi;

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
Route::group(['prefix' => 'coupons'], function () {
    Route::get('list', [CouponApi::class, 'list'])->name('api.auth.coupons.list');
    Route::get('detail/{id}', [CouponApi::class, 'detail'])->name('api.auth.coupons.detail');
    Route::post('search', [CouponApi::class, 'search'])->name('api.auth.coupons.search');
});
Route::group(['prefix' => 'reviews'], function () {
    Route::get('list', [ReviewProductApi::class, 'list'])->name('api.restapi.reviews.list');
});
