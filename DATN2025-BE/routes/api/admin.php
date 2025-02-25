<?php

use App\Http\Controllers\restapi\admin\AdminAttributeApi;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\admin\AdminCategoryApi;

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
