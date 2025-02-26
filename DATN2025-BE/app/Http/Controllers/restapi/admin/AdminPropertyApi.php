<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\AttributeStatus;
use App\Enums\PropertyStatus;
use App\Http\Controllers\Api;
use App\Models\Properties;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class AdminPropertyApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/admin/properties/list",
     *     summary="Get list of properties",
     *     description="Get list of properties",
     *     tags={"Admin Property"},
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
        $properties = Properties::where('properties.status', '!=', PropertyStatus::DELETED)
            ->orderBy('properties.id', 'desc')
            ->join('attributes', 'properties.attribute_id', '=', 'attributes.id')
            ->where('attributes.status', '!=', AttributeStatus::DELETED)
            ->select('properties.*', 'attributes.name as attribute_name')
            ->get();
        $data = returnMessage(1, $properties, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/properties/detail/{id}",
     *     summary="Get detail of a property",
     *     description="Get detail of a property",
     *     tags={"Admin Property"},
     *     @OA\Parameter(
     *         description="Property ID",
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
     *         description="Property not found"
     *     )
     * )
     */
    public function detail($id)
    {
        $property = Properties::where('id', $id)
            ->where('status', '!=', PropertyStatus::DELETED)
            ->first();

        if (!$property) {
            $data = returnMessage(-1, null, 'Property not found!');
            return response()->json($data, 404);
        }

        $data = returnMessage(1, $property, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * Create a property
     *
     * @OA\Post(
     *     path="/api/admin/properties/create",
     *     summary="Create a property",
     *     description="Create a property",
     *     tags={"Admin Property"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Name of the property"
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="integer",
     *                     description="Status of the property"
     *                 ),
     *                 @OA\Property(
     *                     property="attribute_id",
     *                     type="integer",
     *                     description="Attribute ID"
     *                 ),
     *                 @OA\Property(
     *                     property="thumbnail",
     *                     type="string",
     *                     format="binary",
     *                     description="Thumbnail of the property"
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
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function create(Request $request)
    {
        try {
            $property = new Properties();

            $property->name = $request->input('name');
            $property->status = $request->input('status');
            $property->attribute_id = $request->input('attribute_id');

            if ($request->hasFile('thumbnail')) {
                $item = $request->file('thumbnail');
                $itemPath = $item->store('property', 'public');
                $thumbnail = asset('storage/' . $itemPath);
                $property->thumbnail = $thumbnail;
            } else {
                $data = returnMessage(-1, null, 'Error, Please upload thumbnail!');
                return response()->json($data, 400);
            }

            $success = $property->save();

            if ($success) {
                $data = returnMessage(1, $property, 'Success, Create success!');
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
     *     path="/api/admin/properties/update/{id}",
     *     summary="Update a property",
     *     description="Update a property",
     *     tags={"Admin Property"},
     *     @OA\Parameter(
     *         description="Property ID",
     *         in="path",
     *         name="id",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Name of the property"
     *                 ),
     *                 @OA\Property(
     *                     property="thumbnail",
     *                     type="string",
     *                     format="binary",
     *                     description="Thumbnail of the property"
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="integer",
     *                     description="Property status",
     *                     example=PropertyStatus::ACTIVE
     *                 ),
     *                 @OA\Property(
     *                     property="attribute_id",
     *                     type="integer",
     *                     description="Attribute ID",
     *                     example=1
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
     *         response=400,
     *         description="Bad request"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Property not found"
     *     )
     * )
     */
    public function update($id, Request $request)
    {
        try {
            $property = Properties::where('id', $id)
                ->where('status', '!=', PropertyStatus::DELETED)
                ->first();

            if (!$property) {
                $data = returnMessage(-1, null, 'Property not found!');
                return response()->json($data, 404);
            }

            $property->name = $request->input('name');
            $property->status = $request->input('status');
            $property->attribute_id = $request->input('attribute_id');

            if ($request->hasFile('thumbnail')) {
                $item = $request->file('thumbnail');
                $itemPath = $item->store('property', 'public');
                $thumbnail = asset('storage/' . $itemPath);
                $property->thumbnail = $thumbnail;
            }

            $success = $property->save();
            if ($success) {
                $data = returnMessage(1, $property, 'Success, Update success!');
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
     * Delete a property
     *
     * @OA\Delete(
     *     path="/api/admin/properties/delete/{id}",
     *     summary="Delete a property",
     *     description="Delete a property",
     *     tags={"Admin Property"},
     *     @OA\Parameter(
     *         description="Property ID",
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
     *         description="Property not found"
     *     )
     * )
     */
    public function delete($id)
    {
        try {
            $property = Properties::where('id', $id)
                ->where('status', '!=', PropertyStatus::DELETED)
                ->first();

            if (!$property) {
                $data = returnMessage(-1, null, 'Property not found!');
                return response()->json($data, 404);
            }

            $property->status = PropertyStatus::DELETED;
            $success = $property->save();

            if ($success) {
                $data = returnMessage(1, $property, 'Success, Delete success!');
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
