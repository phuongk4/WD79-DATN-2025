<?php

namespace App\Http\Controllers\restapi;

use App\Enums\OrderStatus;
use App\Enums\ReviewStatus;
use App\Http\Controllers\Api;
use App\Models\Orders;
use App\Models\Reviews;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ReviewProductApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/reviews/list",
     *     summary="Get list of reviews",
     *     description="Get list of reviews",
     *     tags={"Review"},
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
        $product_id = $request->input('product_id');
        $reviews = Reviews::where('status', ReviewStatus::APPROVED);

        if ($product_id) {
            $reviews->where('product_id', $product_id);
        }

        $reviews = $reviews->orderBy('id', 'desc')
            ->cursor()
            ->map(function ($item) {
                $review = $item->toArray();

                $user = User::find($item->user_id);

                $review['user'] = $user->toArray();

                return $review;
            });

        $data = returnMessage(1, $reviews, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @OA\Post(
     *     path="/api/reviews",
     *     summary="Store a newly created resource in storage.",
     *     description="Store a newly created resource in storage.",
     *     tags={"Review"},
     *     @OA\RequestBody(
     *         description="Review store",
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="product_id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="Product is good"),
     *             @OA\Property(property="content", type="string", example="Content of reviews"),
     *             @OA\Property(property="stars", type="integer", example=5),
     *             @OA\Property(property="order_id", type="integer", example=1),
     *             @OA\Property(property="thumbnail", type="array", @OA\Items(type="string", example="http://example.com/image.jpg"))
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
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();

            $product_id = $request->input('product_id');
            $title = $request->input('title');
            $content = $request->input('content');
            $stars = $request->input('stars');

            $order_id = $request->input('order_id');

            $review = new Reviews();
            $review->user_id = $user['id'];
            $review->product_id = $product_id;
            $review->title = $title;
            $review->stars = $stars;
            $review->content = $content;

            $gallery = '';
            if ($request->hasFile('thumbnail')) {
                $galleryPaths = array_map(function ($image) {
                    $itemPath = $image->store('reviews', 'public');
                    return asset('storage/' . $itemPath);
                }, $request->file('thumbnail'));
                $gallery = implode(',', $galleryPaths);
            }
            $review->thumbnail = $gallery;

            $review->status = ReviewStatus::APPROVED;

            $review->order_id = $order_id;

            $review->save();

            $data = returnMessage(1, $review, 'success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function check(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate()->toArray();

        $product_id = $request->input('product_id');
        $order_id = $request->input('order_id');

        $isValid = false;
        $orderID = null;

        $review = null;

        if ($product_id && $order_id) {
            $order = Orders::where('id', $order_id)
                ->where('user_id', $user['id'])
                ->where('status', OrderStatus::COMPLETED)
                ->first();
            if ($order) {
                $review = Reviews::where('product_id', $product_id)
                    ->where('order_id', $order_id)
                    ->where('user_id', $user['id'])
                    ->first();

                if ($review) {
                    $user = User::find($review->user_id);
                    $review = $review->toArray();
                    $review['user'] = $user->toArray();

                    $isValid = true;
                    $orderID = $order_id;
                }
            }
        }

        return response(returnMessage(1, ['valid' => $isValid, 'order' => $orderID, 'review' => $review], 'success'), 200);
    }
}
