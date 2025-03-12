<?php

namespace App\Http\Controllers\restapi;

use App\Http\Controllers\Api;
use App\Models\OrderHistories;
use App\Models\User;
use Illuminate\Http\Request;

class OrderHistoryApi extends Api
{
    public function list(Request $request)
    {
        try {
            $order_id = $request->input('order_id');

            $orderHistories = OrderHistories::where('order_id', $order_id)
                ->orderByDesc('id')
                ->cursor()
                ->map(function ($item) {
                    $rs = $item->toArray();

                    $user = User::where('id', $item->user_id)->first();
                    $rs['user_name'] = $user->email;

                    return $rs;
                });

            $data = returnMessage(1, $orderHistories->toArray(), 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}