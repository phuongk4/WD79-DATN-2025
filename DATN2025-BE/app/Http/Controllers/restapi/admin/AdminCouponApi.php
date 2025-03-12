<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\CouponStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MainController;
use App\Models\Coupons;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminCouponApi extends Api
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
            $coupons = Coupons::where('status', '!=', CouponStatus::DELETED)
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
            $coupons = Coupons::where('status', '!=', CouponStatus::ACTIVE)
                ->orderByDesc('id')
                ->get();
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

            if (!$coupon || $coupon->status == CouponStatus::DELETED) {
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

    public function create(Request $request)
    {
        try {
            $coupon = new Coupons();

            $coupon = $this->save($request, $coupon);
            $coupon->save();

            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $coupon = Coupons::find($id);

            if (!$coupon || $coupon->status == CouponStatus::DELETED) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $coupon = $this->save($request, $coupon);
            $coupon->save();

            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function delete($id)
    {
        try {
            $coupon = Coupons::find($id);

            if (!$coupon || $coupon->status == CouponStatus::DELETED) {
                $data = returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!');
                return response($data, 404);
            }

            $coupon->status = CouponStatus::DELETED;
            $coupon->save();

            $data = returnMessage(1, $coupon, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    private function save(Request $request, Coupons $coupon)
    {
        $name = $request->input('name');
        $description = $request->input('description');
        $type = $request->input('type');

        $discount_percent = $request->input('discount_percent');
        $max_discount = $request->input('max_discount');
        $max_set = $request->input('max_set');

        $status = $request->input('status') ?? CouponStatus::ACTIVE;

        $quantity = $request->input('quantity');
        $number_used = $request->input('number_used') ?? 0;

        $start_time = $request->input('start_time');
        $end_time = $request->input('end_time');

        $min_total = $request->input('min_total');

        $created_by = $this->user['id'];

        if ($name != $coupon->name) {
            $coupon->name = $name;
        }

        if (!$coupon->code) {
            $code = (new MainController())->generateRandomString(8);

            $isValid = false;
            do {
                $existCoupon = Coupons::where('code', $code)->first();
                if (!$existCoupon) {
                    $isValid = true;
                } else {
                    $code = (new MainController())->generateRandomString(8);
                }
            } while (!$isValid);

            $coupon->code = $code;
        }

        if ($request->hasFile('thumbnail')) {
            $item = $request->file('thumbnail');
            $itemPath = $item->store('coupon', 'public');
            $thumbnail = asset('storage/' . $itemPath);
            $coupon->thumbnail = $thumbnail;
        }

        $coupon->description = $description;
        $coupon->type = $type;
        $coupon->discount_percent = $discount_percent;
        $coupon->max_discount = $max_discount;
        $coupon->max_set = $max_set;
        $coupon->status = $status;
        $coupon->quantity = $quantity;
        $coupon->number_used = $number_used;
        $coupon->start_time = $start_time;
        $coupon->end_time = $end_time;
        $coupon->created_by = $created_by;
        $coupon->min_total = $min_total;

        return $coupon;
    }
}