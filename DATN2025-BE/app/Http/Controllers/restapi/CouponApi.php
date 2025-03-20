<?php

namespace App\Http\Controllers\restapi;

use App\Enums\CouponStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Coupons;
use Illuminate\Http\Request;

class CouponApi extends Api
{
    public function list()
    {
        try {
            $coupons = Coupons::where('status', CouponStatus::ACTIVE)
                ->orderByDesc('id')
                ->get();
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

            $coupons = Coupons::where('status', CouponStatus::ACTIVE)
                ->orderByDesc('id');

            if ($code) {
                $coupons->where('code', $code);
            }

            if ($name) {
                $coupons->where('name', 'like', "%$name%");
            }

            $coupons->get();

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
            $coupon = Coupons::find($id);

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
}