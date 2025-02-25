<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\AttributeStatus;
use App\Http\Controllers\Api;
use App\Models\Attributes;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;


class AdminAttributeApi extends Api
{

    /**
     * @OA\Get(
     *     path="/api/admin/attributes/list",
     *     summary="Get list of attributes",
     *     description="Get list of attributes",
     *     tags={"Admin Attribute"},
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
        $attributes = Attributes::where('status', '!=', AttributeStatus::DELETED)
            ->orderBy('id', 'desc')
            ->get();
        $data = returnMessage(1, $attributes, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/attributes/detail/{id}",
     *     summary="Get detail of an attribute",
     *     description="Get detail of an attribute",
     *     tags={"Admin Attribute"},
     *     @OA\Parameter(
     *         description="Attribute ID",
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
     *         description="Attribute not found"
     *     )
     * )
     */
    public function detail($id)
    {
        $attribute = Attributes::where('id', $id)
            ->where('status', '!=', AttributeStatus::DELETED)
            ->first();
        if ($attribute == null) {
            $data = returnMessage(-1, null, 'Attribute not found!');
            return response()->json($data, 404);
        }
        $data = returnMessage(1, $attribute, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/attributes/create",
     *     summary="Create an attribute",
     *     description="Create an attribute",
     *     tags={"Admin Attribute"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Attribute name",
     *                 example="Attribute 1"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="integer",
     *                 description="Attribute status",
     *                 example=AttributeStatus::ACTIVE
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
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function create(Request $request)
    {
        try {
            $attribute = new Attributes();

            $attribute->name = $request->input('name');
            $attribute->status = $request->input('status');

            $success = $attribute->save();
            if ($success) {
                $data = returnMessage(1, $attribute, 'Success, Create success!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, null, 'Error, Create error!');
            return response()->json($data, 400);
        } catch (\Exception $e) {
            $data = returnMessage(-1, null, $e->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/admin/attributes/update/{id}",
     *     summary="Update an attribute",
     *     description="Update an attribute",
     *     tags={"Admin Attribute"},
     *     @OA\Parameter(
     *         description="Attribute ID",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         description="Attribute information",
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 description="Attribute name",
     *                 example="Attribute 1"
     *             ),
     *             @OA\Property(
     *                 property="status",
     *                 type="integer",
     *                 description="Attribute status",
     *                 example=AttributeStatus::ACTIVE
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
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function update($id, Request $request)
    {
        try {
            $attribute = Attributes::where('id', $id)
                ->where('status', '!=', AttributeStatus::DELETED)
                ->first();

            $attribute->name = $request->input('name');
            $attribute->status = $request->input('status');

            $success = $attribute->save();
            if ($success) {
                $data = returnMessage(1, $attribute, 'Success, Update success!');
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
     * @OA\Delete(
     *     path="/api/admin/attributes/delete/{id}",
     *     summary="Delete an attribute",
     *     description="Delete an attribute",
     *     tags={"Admin Attribute"},
     *     @OA\Parameter(
     *         description="Attribute ID",
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
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function delete($id)
    {
        try {
            $attribute = Attributes::where('id', $id)
                ->where('status', '!=', AttributeStatus::DELETED)
                ->first();
            $attribute->status = AttributeStatus::DELETED;
            $success = $attribute->save();
            if ($success) {
                $data = returnMessage(1, $attribute, 'Success, Delete success!');
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
