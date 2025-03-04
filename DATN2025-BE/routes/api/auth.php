 <?php

    use App\Http\Controllers\restapi\CartApi;
    use Illuminate\Support\Facades\Route;
    Route::group(['prefix' => 'carts'], function () {
        Route::get('list', [CartApi::class, 'list'])->name('api.auth.carts.list');
        Route::post('add', [CartApi::class, 'addToCart'])->name('api.auth.carts.add');
        Route::post('change-quantity/{id}', [CartApi::class, 'changeQuantity'])->name('api.auth.carts.change');
        Route::post('remove/{id}', [CartApi::class, 'removeCart'])->name('api.auth.carts.remove');
        Route::post('clear', [CartApi::class, 'clearCart'])->name('api.auth.carts.clear');
    });
