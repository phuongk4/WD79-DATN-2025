 <?php

    use App\Http\Controllers\restapi\CartApi;
    use App\Http\Controllers\restapi\CheckoutApi;
use App\Http\Controllers\restapi\MyCouponApi;
use App\Http\Controllers\restapi\OrderApi;
use App\Http\Controllers\restapi\OrderHistoryApi;
use App\Http\Controllers\restapi\ReviewProductApi;
use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\restapi\UserApi;
use App\Models\MyCoupons;
use App\Models\OrderHistories;

    Route::group(['prefix' => 'users'], function () {
        Route::get('get-info', [UserApi::class, 'getUserFromToken'])->name('api.auth.users.information');
        Route::post('update-info', [UserApi::class, 'updateInfo'])->name('api.auth.users.update');
        Route::post('change-password', [UserApi::class, 'changePassword'])->name('api.auth.users.change.password');
    });

    Route::group(['prefix' => 'carts'], function () {
        Route::get('list', [CartApi::class, 'list'])->name('api.auth.carts.list');
        Route::post('add', [CartApi::class, 'addToCart'])->name('api.auth.carts.add');
        Route::post('change-quantity/{id}', [CartApi::class, 'changeQuantity'])->name('api.auth.carts.change');
        Route::post('remove/{id}', [CartApi::class, 'removeCart'])->name('api.auth.carts.remove');
        Route::post('clear', [CartApi::class, 'clearCart'])->name('api.auth.carts.clear');
    });

    Route::group(['prefix' => 'orders'], function () {
        Route::get('list', [OrderApi::class, 'list'])->name('api.auth.orders.list');
        Route::get('detail/{id}', [OrderApi::class, 'detail'])->name('api.auth.carts.detail');
        Route::post('cancel/{id}', [OrderApi::class, 'cancel'])->name('api.auth.orders.cancel');
    });

    Route::group(['prefix' => 'checkout'], function () {
        Route::post('create', [CheckoutApi::class, 'checkout'])->name('api.auth.checkout');
        Route::post('checkout_vnpay', [CheckoutApi::class, 'checkoutByVNPay'])->name('api.auth.checkout.vnpay');
        Route::post('return_checkout_vnpay', [CheckoutApi::class, 'returnCheckout'])->name('api.auth.checkout.return');
    });
    Route::group(['prefix' => 'my-coupons'], function () {
        Route::get('list', [MyCouponApi::class, 'list'])->name('api.auth.my.coupons.list');
        Route::get('detail', [MyCouponApi::class, 'detail'])->name('api.auth.my.coupons.detail');
        Route::get('search', [MyCouponApi::class, 'search'])->name('api.auth.my.coupons.search');
        Route::post('save', [MyCouponApi::class, 'saveCoupon'])->name('api.auth.my.coupons.save');
        Route::delete('delete', [MyCouponApi::class, 'delete'])->name('api.auth.my.coupons.delete');
    });
    Route::group(['prefix' => 'order-histories'], function () {
        Route::get('list', [OrderHistoryApi::class, 'list'])->name('api.auth.order.histories.list');
    });
    Route::group(['prefix' => 'reviews'], function () {
        Route::post('create', [ReviewProductApi::class, 'store'])->name('api.auth.reviews.store');
        Route::get('check', [ReviewProductApi::class, 'check'])->name('api.restapi.reviews.check');
    });
