<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Reviews;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class AdminReviewProductApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/admin/reviews/list",
     *     summary="Get list of reviews",
     *     description="Get list of reviews",
     *     tags={"Admin Review"},
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
        $reviews = Reviews::where('reviews.status', '!=', ReviewStatus::DELETED)
            ->join('products', 'reviews.product_id', '=', 'products.id')
            ->join('users', 'reviews.user_id', '=', 'users.id')
            ->orderBy('reviews.id', 'desc')
            ->select('reviews.*', 'products.name as product_name', 'users.email as email', 'users.phone as phone')
            ->get();
        $data = returnMessage(1, $reviews, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/reviews/detail/{id}",
     *     summary="Get detail of a review",
     *     description="Get detail of a review",
     *     tags={"Admin Review"},
     *     @OA\Parameter(
     *         description="Review ID",
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
     *         description="Review not found!"
     *     )
     * )
     */
    public function detail($id)
    {
        $review = Reviews::where('id', $id)
            ->where('status', '!=', ReviewStatus::DELETED)
            ->first();
        if ($review == null) {
            $data = returnMessage(-1, null, 'Review not found!');
            return response()->json($data, 404);
        }
        $data = returnMessage(1, $review, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/reviews/update/{id}",
     *     summary="Update a review",
     *     description="Update a review",
     *     tags={"Admin Review"},
     *     @OA\Parameter(
     *         description="Review ID",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         description="Review status",
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(
     *                     property="status",
     *                     type="integer",
     *                     example=1,
     *                     description="Review status"
     *                 )
     *             )
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
     *         description="Review not found!"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Error, Update error!"
     *     )
     * )
     */
    public function update($id, Request $request)
    {
        try {
            $review = Reviews::where('id', $id)
                ->where('status', '!=', ReviewStatus::DELETED)
                ->first();
            $review->status = $request->input('status');
            $success = $review->save();
            if ($success) {
                $data = returnMessage(1, $review, 'Success, Update success!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, null, 'Error, Update error!');
            return response()->json($data, 400);
        } catch (\Exception $e) {
            $data = returnMessage(-1, null, $e->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * Delete a review
     *
     * @OA\Delete(
     *     path="/api/admin/reviews/delete/{id}",
     *     tags={"Admin Review"},
     *     summary="Delete a review",
     *     description="Delete a review",
     *     @OA\Parameter(
     *         description="Review ID",
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
     *         response="401",
     *         description="Unauthorized user"
     *     )
     * )
     */
    public function delete($id)
    {
        try {
            $review = Reviews::where('id', $id)
                ->where('status', '!=', ReviewStatus::DELETED)
                ->first();
            $review->status = ReviewStatus::DELETED;
            $success = $review->save();
            if ($success) {
                $data = returnMessage(1, $review, 'Success, Delete success!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, null, 'Error, Delete error!');
            return response()->json($data, 400);
        } catch (\Exception $e) {
            $data = returnMessage(-1, null, $e->getMessage());
            return response()->json($data, 400);
        }
    }
}
