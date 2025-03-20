<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Api;
use App\Models\OrderHistories;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\ProductOptions;
use App\Models\Products;
use App\Models\Revenues;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminOrderApi extends Api
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

    /**
     * @OA\Get(
     *     path="/api/admin/orders/list",
     *     summary="Get list of orders",
     *     description="Get list of orders",
     *     tags={"Admin Order"},
     *     @OA\Parameter(
     *         description="Order status",
     *         in="query",
     *         name="status",
     *         required=false,
     *         example="processing",
     *         @OA\Schema(
     *             type="string",
     *             enum={"processing", "shipping", "delivered", "canceled", "deleted"}
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="User id",
     *         in="query",
     *         name="user_id",
     *         required=false,
     *         example=1,
     *         @OA\Schema(
     *             type="integer"
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
        $status = $request->input('status');
        $user_id = $request->input('user_id');

        if ($status) {
            $orders = Orders::where('status', $status);
        } else {
            $orders = Orders::where('status', '!=', OrderStatus::DELETED);
        }

        if ($user_id) {
            $orders = $orders->where('user_id', $user_id);
        }

        $orders = $orders->orderBy('id', 'desc')
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
     *     path="/api/admin/orders/detail/{id}",
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
        $order = Orders::find($id);

        if (!$order || $order->status == OrderStatus::DELETED) {
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
                return $order;
            });

        $order_convert['order_items'] = $order_items->toArray();

        $data = returnMessage(1, $order_convert, 'Success');
        return response($data, 200);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/orders/update/{id}",
     *     summary="Update order status",
     *     description="Update order status",
     *     tags={"Admin Order"},
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
     *     @OA\Parameter(
     *         description="Order status",
     *         in="query",
     *         name="status",
     *         required=true,
     *         example="canceled",
     *         @OA\Schema(
     *             type="string",
     *             enum={"canceled", "completed"}
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid request"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Order not found"
     *     )
     * )
     */
    public function update($id, Request $request)
    {
        try {
            $reason_cancel = $request->input('reason_cancel');
            $order = Orders::find($id);
            if (!$order || $order->status == OrderStatus::DELETED) {
                $data = returnMessage(0, null, 'Order not found');
                return response($data, 404);
            }

            $status = $request->input('status') ?? $order->status;

//            if ($status == OrderStatus::CANCELED) {
//                if ($order->status == OrderStatus::CONFIRMED) {
//                    $data = returnMessage(0, null, 'Đơn hàng đã được xác nhận!');
//                    return response($data, 400);
//                }
//
//                if ($order->status == OrderStatus::SHIPPING) {
//                    $data = returnMessage(0, null, 'Đơn hàng đang vận chuyển!');
//                    return response($data, 400);
//                }
//
//                if ($order->status == OrderStatus::CANCELED) {
//                    $data = returnMessage(0, null, 'Order already canceled');
//                    return response($data, 400);
//                }
//
//                if ($order->status == OrderStatus::COMPLETED) {
//                    $data = returnMessage(0, null, 'Order already completed');
//                    return response($data, 400);
//                }
//            }

            if ($status == OrderStatus::CANCELED) {
                if ($order->status == OrderStatus::SHIPPING) {
                    $data = returnMessage(0, null, 'Đơn hàng đang vận chuyển!');
                    return response($data, 400);
                }

                if ($order->status == OrderStatus::DELIVERED) {
                    $data = returnMessage(0, null, 'Đơn hàng đã được giao!');
                    return response($data, 400);
                }

                if ($order->status == OrderStatus::CANCELED) {
                    $data = returnMessage(0, null, 'Order already canceled');
                    return response($data, 400);
                }

                if ($order->status == OrderStatus::COMPLETED) {
                    $data = returnMessage(0, null, 'Order already completed');
                    return response($data, 400);
                }

            }

            switch ($status) {
                case OrderStatus::PENDING:
                    $status = OrderStatus::PROCESSING;
                    break;
                case OrderStatus::PROCESSING:
                    $status = OrderStatus::CONFIRMED;
                    break;
                case OrderStatus::CONFIRMED:
                    $status = OrderStatus::SHIPPING;
                    break;
                case OrderStatus::SHIPPING:
                    $status = OrderStatus::DELIVERED;
                    break;
                case OrderStatus::CANCELED:
                    $order->reason_cancel = $reason_cancel;
                    $status = OrderStatus::CANCELED;
                    break;
                default:
                    $status = OrderStatus::COMPLETED;
                    break;
            }

            $order->status = $status;
            $order->save();

            if ($status == OrderStatus::CANCELED) {
                $order_items = OrderItems::where('order_id', $order->id)->get();
                $order_items->each(function ($item) {
                    $option = ProductOptions::find($item->value);
                    $option->quantity = $option->quantity + $item->quantity;
                    $option->save();
                });
            }

            if ($status == OrderStatus::COMPLETED) {
                $revenue = new Revenues();
                $revenue->total = $order->total_price;
                $revenue->order_id = $order->id;

                $revenue->date = Carbon::now()->day;
                $revenue->month = Carbon::now()->month;
                $revenue->year = Carbon::now()->year;

                $revenue->save();
            }

            $order_history = new OrderHistories();
            $order_history->order_id = $order->id;
            $order_history->status = $status;
            $order_history->notes = $order->reason_cancel;
            $order_history->user_id = $this->user['id'];
            $order_history->save();

            $data = returnMessage(1, $order, 'Update order success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}
