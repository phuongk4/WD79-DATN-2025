<?php

namespace App\Http\Controllers\restapi;

use App\Enums\CouponStatus;
use App\Enums\MyCouponStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Coupons;
use App\Models\MyCoupons;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class MyCouponApi extends Api
{
    protected $user;

    /**
     * Instantiate a new CheckoutController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->user = JWTAuth::parseToken()->authenticate()->toArray();
    }

    public function list()
    {
        try {
            $coupons = MyCoupons::where('user_id', $this->user['id'])
                ->orderByDesc('id')
                ->cursor()
                ->map(function ($item) {
                    $mycoupon = $item->toArray();

                    $coupon = Coupons::where('id', $item->coupon_id)->first();
                    $mycoupon['coupon'] = $coupon->toArray();
                    return $mycoupon;
                });
            $data = returnMessage(1, $coupons, 'Success');

            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function search(Request $request)
    {
        try {
            $code = $request->input('code');
            $name = $request->input('name');

            $coupons = MyCoupons::where('my_coupons.user_id', $this->user['id'])
                ->join('coupons', 'coupons.id', '=', 'my_coupons.coupon_id')
                ->where('my_coupons.status', MyCouponStatus::UNUSED)
                ->select('my_coupons.*', 'coupons.*') // Adjust selection as needed
                ->orderByDesc('my_coupons.id');

            if ($code) {
                $coupons->where('coupons.code', $code);
            }

            if ($name) {
                $coupons->where('coupons.name', 'like', "%$name%");
            }

            $coupons = $coupons->get();

            $data = returnMessage(1, $coupons, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function detail($id)
    {
        try {
            $coupon = MyCoupons::find($id);

            if (!$coupon) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $coupon = Coupons::where($coupon->coupon_id);

            if (!$coupon || $coupon->status != CouponStatus::ACTIVE) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $data = returnMessage(1, $coupon, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function saveCoupon(Request $request)
    {
        try {
            $user_id = $this->user['id'];
            $coupon_id = $request->input('coupon_id');
            $status = MyCouponStatus::UNUSED;

            $coupon = Coupons::find($coupon_id);

            if (!$coupon || $coupon->status != CouponStatus::ACTIVE) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $count = MyCoupons::where('coupon_id', $coupon_id)->where('user_id', $user_id)->count();

            if ($count >= $coupon->max_set) {
                $data = returnMessage(-1, '', 'Đã đạt đến giới hạn lưu trữ tối đa!');
                return response($data, 400);
            }

            $myCoupon = new MyCoupons();

            $myCoupon->coupon_id = $coupon_id;
            $myCoupon->user_id = $user_id;
            $myCoupon->status = $status;

            $myCoupon->save();

            $data = returnMessage(1, $myCoupon, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function delete($id)
    {
        try {
            $coupon = MyCoupons::find($id);

            if (!$coupon || $coupon->status != CouponStatus::ACTIVE) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $coupon?->delete();

            $data = returnMessage(1, 'Delete success!', 'Delete success!');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}