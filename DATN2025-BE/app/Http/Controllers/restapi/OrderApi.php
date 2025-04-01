<?php

namespace App\Http\Controllers\restapi;

use App\Enums\OrderStatus;
use App\Http\Controllers\Api;
use App\Models\Attributes;
use App\Models\OrderHistories;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\ProductOptions;
use App\Models\Products;
use App\Models\Properties;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/orders/list",
     *     summary="Get list of orders",
     *     description="Get list of orders",
     *     tags={"Order"},
     *     @OA\Parameter(
     *         description="Order status",
     *         in="query",
     *         name="status",
     *         required=false,
     *         example="processing",
     *         @OA\Schema(
     *           type="string",
     *           enum={"processing", "shipping", "delivered", "canceled", "deleted"}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized user"
     *     )
     * )
     */
    public function list(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user = $user->toArray();

        $status = $request->input('status');

        if ($status) {
            $orders = Orders::where('status', $status);
        } else {
            $orders = Orders::where('status', '!=', OrderStatus::DELETED);
        }

        $orders = $orders->where('user_id', $user['id'])
            ->orderBy('id', 'desc')
            ->cursor()
            ->map(function ($item) {
                $order = $item->toArray();
                $order_items = OrderItems::where('order_id', $item->id)->get();
                $order['order_items'] = $order_items->toArray();
                return $order;
            });

        $data = returnMessage(1, $orders, 'Success');
        return response($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/orders/detail/{id}",
     *     summary="Get detail of an order",
     *     description="Get detail of an order",
     *     tags={"Order"},
     *     @OA\Parameter(
     *         description="Order ID",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized user"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Order not found"
     *     )
     * )
     */
    public function detail($id)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user = $user->toArray();

        $order = Orders::find($id);
        if (!$order || $order->status == OrderStatus::DELETED || $order->user_id != $user['id']) {
            $data = returnMessage(0, null, 'Order not found');
            return response($data, 404);
        }

        $order_convert = $order->toArray();

        $order_items = OrderItems::where('order_id', $id)
            ->cursor()
            ->map(function ($item) {
                $order = $item->toArray();
                $product = Products::find($item->product_id);
                $order['product'] = $product->toArray();

                $product_option = ProductOptions::where('id', $item->value)->first();
                $order['product_options'] = $product_option->toArray();

                $dataArray = $product_option->value;
                $dataArray = json_decode($dataArray, true);

                $dataConvert = [];
                foreach ($dataArray as $op) {
                    $attribute = Attributes::find($op['attribute_item']);
                    $property = Properties::find($op['property_item']);

                    $data = [
                        'attribute' => $attribute->toArray(),
                        'property' => $property->toArray()
                    ];

                    $dataConvert[] = $data;
                }
                $order['attribute'] = $dataConvert;

                return $order;
            });

        $order_convert['order_items'] = $order_items->toArray();
        $data = returnMessage(1, $order_convert, 'Success');
        return response($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/orders/cancel/{id}",
     *     summary="Cancel an order",
     *     description="Cancel an order",
     *     tags={"Order"},
     *     @OA\Parameter(
     *         description="Order ID",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized user"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Order not found"
     *     )
     * )
     */
    public function cancel($id, Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();

            $order = Orders::find($id);
            if (!$order || $order->status == OrderStatus::DELETED || $order->user_id != $user['id']) {
                $data = returnMessage(0, null, 'Order not found');
                return response($data, 404);
            }

            if ($order->status == OrderStatus::CONFIRMED) {
                $data = returnMessage(0, null, 'Đơn hàng đã được xác nhận!');
                return response($data, 400);
            }

            if ($order->status == OrderStatus::SHIPPING) {
                $data = returnMessage(0, null, 'Đơn hàng đang vận chuyển!');
                return response($data, 400);
            }

            if ($order->status == OrderStatus::CANCELED) {
                $data = returnMessage(0, null, 'Đơn hàng đã huỷ!');
                return response($data, 400);
            }

            if ($order->status == OrderStatus::COMPLETED) {
                $data = returnMessage(0, null, 'Đơn hàng đã hoàn thành!');
                return response($data, 400);
            }

            $reason_cancel = $request->input('reason_cancel');

            $order->status = OrderStatus::CANCELED;
            $order->reason_cancel = $reason_cancel;
            $order->save();

            $order_items = OrderItems::where('order_id', $order->id)->get();

            $order_items->each(function ($item) {
                $option = ProductOptions::find($item->value);
                $option->quantity = $option->quantity + $item->quantity;
                $option->save();

                $product = Products::find($option->product_id);
                $product->quantity = $product->quantity + $item->quantity;

                $product->save();
            });

            $order_history = new OrderHistories();
            $order_history->order_id = $order->id;
            $order_history->status = OrderStatus::CANCELED;
            $order_history->user_id = $order->user_id;
            $order_history->notes = $order->reason_cancel;
            $order_history->save();

            $data = returnMessage(1, $order, 'Cancel success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}
