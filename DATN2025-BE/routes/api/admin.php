<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\restapi\admin\AdminCategoryApi;

Route::group(['prefix' => 'categories'], function () {
    Route::get('list', [AdminCategoryApi::class, 'list'])->name('api.admin.categories.list');
    Route::get('detail/{id}', [AdminCategoryApi::class, 'detail'])->name('api.admin.categories.detail');
    Route::post('create', [AdminCategoryApi::class, 'create'])->name('api.admin.categories.create');
    Route::post('update/{id}', [AdminCategoryApi::class, 'update'])->name('api.admin.categories.update');
    Route::delete('delete/{id}', [AdminCategoryApi::class, 'delete'])->name('api.admin.categories.delete');
});
