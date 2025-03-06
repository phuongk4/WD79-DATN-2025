<?php

namespace App\Http\Controllers\restapi;

use App\Enums\OrderMethod;
use App\Enums\OrderStatus;
use App\Http\Controllers\Api;
use App\Models\Carts;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\ProductOptions;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckoutApi extends Api
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
     * @OA\Post(
     *     path="/api/checkout",
     *     summary="Checkout",
     *     tags={"Checkout"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Send order info",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="_token", type="string", example="token"),
     *             @OA\Property(property="full_name", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="c_email_address", type="string", example="nguyenvana@gmail.com"),
     *             @OA\Property(property="c_phone", type="string", example="0909090909"),
     *             @OA\Property(property="c_address", type="string", example="Ha Noi"),
     *             @OA\Property(property="d_address", type="string", example="Ho Chi Minh"),
     *             @OA\Property(property="order_method", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="c_total_product", type="integer", example=100000),
     *             @OA\Property(property="c_shipping_price", type="integer", example=100000),
     *             @OA\Property(property="c_discount_price", type="integer", example=100000),
     *             @OA\Property(property="c_total", type="integer", example=100000),
     *             @OA\Property(property="c_order_notes", type="string", example="abc")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Checkout successfully!"),
     *     @OA\Response(response=400, description="Checkout error!")
     * )
     */
    public function checkout(Request $request)
    {
        try {
            $user_id = $this->user['id'];
            $carts = Carts::where('user_id', $user_id)->get();

            if ($carts->count() == 0) {
                $data = returnMessage(-1, 'Your cart is empty!', 'Your cart is empty!');
                return response()->json($data, 400);
            }
            $order_created = $this->handleCheckout($request);
            if ($order_created) {
                $user_id = $this->user['id'];
                Carts::where('user_id', $user_id)->delete();

                $data = returnMessage(1, 'Checkout successfully!', 'Checkout successfully!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, 'Checkout error!', 'Checkout error!');
            return response()->json($data, 400);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, $exception->getMessage(), $exception->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/return_checkout_vnpay",
     *     summary="Checkout",
     *     tags={"Checkout"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Send order info",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="_token", type="string", example="token"),
     *             @OA\Property(property="full_name", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="c_email_address", type="string", example="nguyenvana@gmail.com"),
     *             @OA\Property(property="c_phone", type="string", example="0909090909"),
     *             @OA\Property(property="c_address", type="string", example="Ha Noi"),
     *             @OA\Property(property="d_address", type="string", example="Ho Chi Minh"),
     *             @OA\Property(property="order_method", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="c_total_product", type="integer", example=100000),
     *             @OA\Property(property="c_shipping_price", type="integer", example=100000),
     *             @OA\Property(property="c_discount_price", type="integer", example=100000),
     *             @OA\Property(property="c_total", type="integer", example=100000),
     *             @OA\Property(property="c_order_notes", type="string", example="abc")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Checkout successfully!"),
     *     @OA\Response(response=400, description="Checkout error!")
     * )
     */
    public function returnCheckout(Request $request)
    {
        try {
            $user_id = $this->user['id'];
            $carts = Carts::where('user_id', $user_id)->get();
            if ($carts->count() == 0) {
                $data = returnMessage(-1, 'Your cart is empty!', 'Your cart is empty!');
                return response()->json($data, 400);
            }

            $url = session('url_prev', '/');

            if ($request->vnp_ResponseCode == "00") {
                $listValue = session('listValue');
                $arrayValue = explode(',', $listValue);

                $request->merge([
                    '_token' => $arrayValue[0],
                    'full_name' => $arrayValue[1],
                    'c_email_address' => $arrayValue[2],
                    'c_phone' => $arrayValue[3],
                    'c_address' => $arrayValue[4],
                    'd_address' => $arrayValue[5],
                    'order_method' => OrderMethod::CARD_CREDIT,
                    'user_id' => $arrayValue[6],
                    'c_total_product' => $arrayValue[7],
                    'c_shipping_price' => $arrayValue[8],
                    'c_discount_price' => $arrayValue[9],
                    'c_total' => $arrayValue[10],
                    'c_order_notes' => $arrayValue[11],
                ]);

                $order_created = $this->handleCheckout($request);
                if ($order_created) {
                    $user_id = $this->user['id'];
                    Carts::where('user_id', $user_id)->delete();
                    $data = returnMessage(1, $url, 'Checkout successfully!');
                    return response()->json($data, 200);
                }
            }

            $data = returnMessage(-1, $url, 'Lỗi trong quá trình thanh toán phí dịch vụ');
            return response()->json($data, 400);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, $exception->getMessage(), $exception->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * Checkout by VNPay
     *
     * @OA\Post(
     *     path="/api/checkout_vnpay",
     *     summary="Checkout using VNPay",
     *     tags={"Checkout"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="email",
     *                 type="string",
     *                 example="user@example.com",
     *                 description="Recipient email address."
     *             ),
     *             @OA\Property(
     *                 property="c_total",
     *                 type="integer",
     *                 example=100000,
     *                 description="Total amount for the order, in VND."
     *             ),
     *             @OA\Property(
     *                 property="_token",
     *                 type="string",
     *                 example="abcdef123456",
     *                 description="CSRF token for security."
     *             ),
     *             @OA\Property(
     *                 property="full_name",
     *                 type="string",
     *                 example="John Doe",
     *                 description="Full name of the customer."
     *             ),
     *             @OA\Property(
     *                 property="c_email_address",
     *                 type="string",
     *                 example="john.doe@example.com",
     *                 description="Customer's email address."
     *             ),
     *             @OA\Property(
     *                 property="c_phone",
     *                 type="string",
     *                 example="0912345678",
     *                 description="Customer's phone number."
     *             ),
     *             @OA\Property(
     *                 property="c_address",
     *                 type="string",
     *                 example="123 Main St, Hanoi",
     *                 description="Billing address of the customer."
     *             ),
     *             @OA\Property(
     *                 property="d_address",
     *                 type="string",
     *                 example="456 Elm St, Hanoi",
     *                 description="Delivery address."
     *             ),
     *             @OA\Property(
     *                 property="c_total_product",
     *                 type="integer",
     *                 example=90000,
     *                 description="Total price of products."
     *             ),
     *             @OA\Property(
     *                 property="c_shipping_price",
     *                 type="integer",
     *                 example=5000,
     *                 description="Shipping price."
     *             ),
     *             @OA\Property(
     *                 property="c_discount_price",
     *                 type="integer",
     *                 example=5000,
     *                 description="Discount applied to the order."
     *             ),
     *             @OA\Property(
     *                 property="c_order_notes",
     *                 type="string",
     *                 example="Leave package at the front door.",
     *                 description="Additional notes about the order."
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Bad request."),
     *     @OA\Response(response=401, description="Unauthorized."),
     *     @OA\Response(response=404, description="Order not found."),
     *     @OA\Response(response=200, description="Success."),
     *     @OA\Response(response=500, description="Internal Server Error.")
     * )
     */
    public function checkoutByVNPay(Request $request)
    {
        $user_id = $this->user['id'];
        $carts = Carts::where('user_id', $user_id)->get();
        if ($carts->count() == 0) {
            $data = returnMessage(-1, 'Your cart is empty!', 'Your cart is empty!');
            return response()->json($data, 400);
        }

        $emailTo = $request->input('email');
        $money = $request->input('c_total');
        $token = $request->input('_token');

        $full_name = $request->input('full_name');
        $email = $request->input("c_email_address");
        $phone = $request->input('c_phone');
        $c_address = $request->input('c_address');
        $d_address = $request->input('d_address');

        $user_id = $this->user['id'];

        $total = $request->input("c_total_product");
        $shippingPrice = $request->input('c_shipping_price');
        $salePrice = $request->input('c_discount_price');
        $vnpAmount = $request->input('c_total');

        $c_order_notes = $request->input('c_order_notes');
        $vnp_ReturnUrl = 'http://localhost:3000/checkout_success';


        session(['emailTo' => $emailTo]);
        $money = $money . '00';
        $money = (int)$money;
        session(['cost_id' => $request->id]);
        session(['url_prev' => url()->previous()]);
        $vnp_TmnCode = "DX99JC99";
        $vnp_HashSecret = "NTMFIAYIYAEFEAMZVWNCESERJMBVROKS";
        $vnp_TxnRef = date("YmdHis");
        $vnp_Amount = $money;
        $vnp_Locale = 'vn';
        $user = $this->user;
        $vnp_IpAddr = $request->input('c_address');
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_apiUrl = "http://sandbox.vnpayment.vn/merchant_webapi/merchant.html";
        $apiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
        $startTime = date("YmdHis");
        $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));

        $array[] = $token;

        $array[] = $full_name;
        $array[] = $email;
        $array[] = $phone;
        $array[] = $c_address;
        $array[] = $d_address;

        $array[] = $user_id;

        $array[] = $total;
        $array[] = $shippingPrice;
        $array[] = $salePrice;
        $array[] = $vnpAmount;

        $array[] = $c_order_notes;

        $listValue = implode(',', $array);

        session(['listValue' => $listValue]);

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => "Thanh toan GD:" . $vnp_TxnRef,
            "vnp_OrderType" => "270000",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);//
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        $data = returnMessage(1, $vnp_Url, 'Success');

        return response($data, 200);
    }

    /**
     * Handle checkout
     *
     * @param \Illuminate\Http\Request $request
     * @return boolean
     */
    private function handleCheckout(Request $request)
    {
        $order = new Orders();

        $coupon_id = $request->input('coupon_id') ?? '';
        $user_id = $this->user['id'];

        $carts = Carts::where('user_id', $user_id)->get();

        $full_name = $request->input('full_name');
        $email = $request->input('c_email_address');
        $phone = $request->input('c_phone');
        $c_address = $request->input('c_address');
        $d_address = $request->input('d_address');
        $total_product = $request->input('c_total_product');
        $shipping_price = $request->input('c_shipping_price') ?? 0;
        $discount_price = $request->input('c_discount_price') ?? 0;
        $total = $request->input('c_total');
        $notes = $request->input('c_order_notes');
        $order_method = $request->input('order_method') ?? OrderMethod::IMMEDIATE;
        $status = OrderStatus::PROCESSING;

        $address = $c_address . ', ' . $d_address;

        $order->full_name = $full_name;
        $order->email = $email;
        $order->phone = $phone;
        $order->address = $address;
        $order->products_price = $total_product;
        $order->shipping_price = $shipping_price;
        $order->discount_price = $discount_price;
        $order->total_price = $total;
        $order->notes = $notes;
        $order->order_method = $order_method;
        $order->status = $status;

        $order->user_id = $user_id;

        $order_created = $order->save();

        foreach ($carts as $cart) {
            $order_item = new OrderItems();

            $order_item->product_id = $cart->product_id;
            $order_item->quantity = $cart->quantity;

            $order_item->order_id = $order->id;
            $order_item->value = $cart->values;

            $option = ProductOptions::find($cart->values);

            $order_item->price = $option->sale_price ?? $cart->product->sale_price;

            $order_item->save();

            /**
             * Xử lí khi mua đơn hàng sẽ trừ đi số sản phẩm đã mua
             * */
//            $product = Products::find($cart->product_id);
//            $product->quantity -= $cart->quantity;
//            $product->save();

            $option->quantity -= $cart->quantity;
            $option->save();
        }
        return $order_created;
    }
}
