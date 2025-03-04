<?php

namespace App\Http\Controllers\restapi;

use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Attributes;
use App\Models\Carts;
use App\Models\ProductOptions;
use App\Models\Products;
use App\Models\Properties;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;

class CartApi extends Api
{
    /**
     * Get list cart
     *
     * @OA\Get(
     *     path="/api/carts/list",
     *     summary="Get list cart",
     *     tags={"Cart"},
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=400, description="Error")
     * )
     */
    public function list()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user = $user->toArray();

        $carts = Carts::where('user_id', $user['id'])
            ->cursor()
            ->map(function ($item) {
                $cart = $item->toArray();
                $product = Products::find($item->product_id);
                $cart['product'] = $product->toArray();

                $val = $item->values;
                $product_option = ProductOptions::find($val);
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
                $cart['attribute'] = $dataConvert;
                $cart['product_option'] = $product_option->toArray();
                return $cart;
            });

        $data = returnMessage(1, $carts, 'Success');
        return response($data, 200);
    }

    /**
     * Add to cart
     *
     * @OA\Post(
     *     path="/api/carts/add",
     *     summary="Add to cart",
     *     tags={"Cart"},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="product_id",
     *                 type="integer",
     *                 example=1
     *             ),
     *             @OA\Property(
     *                 property="quantity",
     *                 type="integer",
     *                 example=1
     *             ),
     *             @OA\Property(
     *                 property="values",
     *                 type="string",
     *                 example="",
     *                 description="Json string, example: [[{attribute_item: 1, property_item: 1}, {attribute_item: 2, property_item: 2}]]"
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Bad request"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Product not found!"),
     *     @OA\Response(response=200, description="Success"),
     *     @OA\Response(response=500, description="Internal Server Error")
     * )
     */
    public function addToCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();
            $user_id = $user['id'];

            $product_id = $request->input('product_id');
            $quantity = $request->input('quantity');
            $values = $request->input('values') ?? '';

            if ($quantity < 1) {
                $data = returnMessage(-1, '', 'Quantity must be greater than 0!');
                return response($data, 400);
            }

            $product = Products::find($product_id);

            if (!$product) {
                $data = returnMessage(-1, '', 'Product not found!');
                return response($data, 400);
            }

            if (!$values) {
                $option_default = ProductOptions::where('product_id', $product_id)->first();
                if ($option_default) {
                    $values = $option_default->id;
                }
            }

            $cart = Carts::where('user_id', $user_id)
                ->where('product_id', $product_id)
                ->where('values', $values)
                ->first();

            $option = ProductOptions::find($values);

            if ($cart) {
                $quantity = $cart->quantity + $quantity;

                if ($option) {
                    if ($quantity > $option->quantity) {
                        $data = returnMessage(-1, '', 'Quantity not enough!');
                        return response($data, 400);
                    }
                }

                $cart->quantity = $quantity;
                $cart->save();
            } else {
                $cart = new Carts();

                if ($option) {
                    if ($quantity > $option->quantity) {
                        $data = returnMessage(-1, '', 'Quantity not enough!');
                        return response($data, 400);
                    }
                }

                $cart->product_id = $product_id;
                $cart->user_id = $user_id;
                $cart->quantity = $quantity;
                $cart->values = $values;

                $cart->save();
            }

            $data = returnMessage(1, $cart, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    /**
     * Change quantity of a product in cart
     *
     * @OA\Put(
     *     path="/api/carts/change-quantity/{id}",
     *     summary="Change quantity of a product in cart",
     *     tags={"Cart"},
     *     @OA\Parameter(
     *         in="path",
     *         name="id",
     *         required=true,
     *         description="Cart ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="quantity",
     *                 type="integer",
     *                 example=1,
     *                 description="Quantity of product"
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Bad request"),
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=404, description="Cart not found!"),
     *     @OA\Response(response=500, description="Internal Server Error")
     * )
     */
    public function changeQuantity($id, Request $request)
    {
        try {
            $qty = $request->input('quantity');
            $cart = Carts::find($id);
            if (!$cart) {
                $data = returnMessage(-1, '', 'Cart not found!');
                return response($data, 404);
            }

            if ($qty < 1) {
                $data = returnMessage(-1, '', 'Quantity must be greater than 0!');
                return response($data, 400);
            }

            $product = Products::find($cart->product_id);
            if ($product->quantity < $qty) {
                $data = returnMessage(-1, '', 'Quantity not enough!');
                return response($data, 400);
            }

            $cart->quantity = $qty;
            $cart->save();
            $data = returnMessage(1, $cart, 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    /**
     * Remove cart
     *
     * @OA\Post(
     *     path="/api/carts/remove/{id}",
     *     tags={"Cart"},
     *     summary="Remove cart",
     *     description="Remove cart",
     *     @OA\Parameter(
     *         description="id",
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
     *         response=400,
     *         description="Invalid ID supplied"
     *     ),
     *     security={
     *         {"bearerAuth": {}}
     *     }
     * )
     */
    public function removeCart($id)
    {
        try {
            $cart = Carts::find($id);
            $cart?->delete();
            $data = returnMessage(1, 'Remove success!', 'Remove success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    /**
     * Clear cart
     *
     * @OA\Post(
     *     path="/api/carts/clear",
     *     summary="Clear cart",
     *     tags={"Cart"},
     *     @OA\Response(response=401, description="Unauthorized"),
     *     @OA\Response(response=200, description="Clear success"),
     *     @OA\Response(response=400, description="Error")
     * )
     */
    public function clearCart()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();

            $carts = Carts::where('user_id', $user['id'])->delete();
            $data = returnMessage(1, 'Clear success!', 'Clear success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}
