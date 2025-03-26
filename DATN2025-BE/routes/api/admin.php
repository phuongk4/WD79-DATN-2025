<?php

use App\Http\Controllers\restapi\admin\AdminAttributeApi;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\admin\AdminCategoryApi;
use App\Http\Controllers\restapi\admin\AdminCouponApi;
use App\Http\Controllers\restapi\admin\AdminHomeApi;
use App\Http\Controllers\restapi\admin\AdminOrderApi;
use App\Http\Controllers\restapi\admin\AdminPropertyApi;
use App\Http\Controllers\restapi\admin\AdminProductApi;
use App\Http\Controllers\restapi\admin\AdminRevenueApi;
use App\Http\Controllers\restapi\admin\AdminReviewProductApi;
Route::group(['prefix' => ''], function () {
    Route::get('dashboard', [AdminHomeApi::class, 'dashboard'])->name('api.admin.home.dashboard');
    Route::get('chart-orders', [AdminHomeApi::class, 'chartOrders'])->name('api.admin.home.chart-orders');
});

Route::group(['prefix' => 'categories'], function () {
    Route::get('list', [AdminCategoryApi::class, 'list'])->name('api.admin.categories.list');
    Route::get('detail/{id}', [AdminCategoryApi::class, 'detail'])->name('api.admin.categories.detail');
    Route::post('create', [AdminCategoryApi::class, 'create'])->name('api.admin.categories.create');
    Route::post('update/{id}', [AdminCategoryApi::class, 'update'])->name('api.admin.categories.update');
    Route::delete('delete/{id}', [AdminCategoryApi::class, 'delete'])->name('api.admin.categories.delete');
});

Route::group(['prefix' => 'attributes'], function () {
    Route::get('list', [AdminAttributeApi::class, 'list'])->name('api.admin.attributes.list');
    Route::get('detail/{id}', [AdminAttributeApi::class, 'detail'])->name('api.admin.attributes.detail');
    Route::post('create', [AdminAttributeApi::class, 'create'])->name('api.admin.attributes.create');
    Route::post('update/{id}', [AdminAttributeApi::class, 'update'])->name('api.admin.attributes.update');
    Route::delete('delete/{id}', [AdminAttributeApi::class, 'delete'])->name('api.admin.attributes.delete');
});

Route::group(['prefix' => 'properties'], function () {
    Route::get('list', [AdminPropertyApi::class, 'list'])->name('api.admin.properties.list');
    Route::get('detail/{id}', [AdminPropertyApi::class, 'detail'])->name('api.admin.properties.detail');
    Route::post('create', [AdminPropertyApi::class, 'create'])->name('api.admin.properties.create');
    Route::post('update/{id}', [AdminPropertyApi::class, 'update'])->name('api.admin.properties.update');
    Route::delete('delete/{id}', [AdminPropertyApi::class, 'delete'])->name('api.admin.properties.delete');
});

Route::group(['prefix' => 'products'], function () {
    Route::get('list', [AdminProductApi::class, 'list'])->name('api.admin.products.list');
    Route::get('detail/{id}', [AdminProductApi::class, 'detail'])->name('api.admin.products.detail');
    Route::post('create', [AdminProductApi::class, 'create'])->name('api.admin.products.create');
    Route::post('update/{id}', [AdminProductApi::class, 'update'])->name('api.admin.products.update');
    Route::delete('delete/{id}', [AdminProductApi::class, 'delete'])->name('api.admin.products.delete');
});

Route::group(['prefix' => 'orders'], function () {
    Route::get('list', [AdminOrderApi::class, 'list'])->name('api.admin.orders.list');
    Route::get('detail/{id}', [AdminOrderApi::class, 'detail'])->name('api.admin.orders.detail');
    Route::post('update/{id}', [AdminOrderApi::class, 'update'])->name('api.admin.orders.update');
});
Route::group(['prefix' => 'coupons'], function () {
    Route::get('list', [AdminCouponApi::class, 'list'])->name('api.admin.coupons.list');
    Route::get('detail/{id}', [AdminCouponApi::class, 'detail'])->name('api.admin.coupons.detail');
    Route::post('create', [AdminCouponApi::class, 'create'])->name('api.admin.coupons.create');
    Route::post('update/{id}', [AdminCouponApi::class, 'update'])->name('api.admin.coupons.update');
    Route::delete('delete/{id}', [AdminCouponApi::class, 'delete'])->name('api.admin.coupons.delete');
});
Route::group(['prefix' => 'reviews'], function () {
    Route::get('list', [AdminReviewProductApi::class, 'list'])->name('api.admin.reviews.list');
    Route::get('detail/{id}', [AdminReviewProductApi::class, 'detail'])->name('api.admin.reviews.detail');
    Route::put('update/{id}', [AdminReviewProductApi::class, 'update'])->name('api.admin.reviews.update');
    Route::delete('delete/{id}', [AdminReviewProductApi::class, 'delete'])->name('api.admin.reviews.delete');
});
Route::group(['prefix' => 'revenues'], function () {
    Route::get('list', [AdminRevenueApi::class, 'list'])->name('api.admin.revenues.list');
    Route::get('charts', [AdminRevenueApi::class, 'charts'])->name('api.admin.revenues.charts');
});
