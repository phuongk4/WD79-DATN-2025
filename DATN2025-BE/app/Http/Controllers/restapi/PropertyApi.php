<?php

namespace App\Http\Controllers\restapi;

use App\Enums\AttributeStatus;
use App\Enums\PropertyStatus;
use App\Http\Controllers\Api;
use App\Models\Properties;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class PropertyApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/properties/list",
     *     summary="Get list of properties",
     *     description="Get list of properties",
     *     tags={"Property"},
     *     @OA\Parameter(
     *         name="name",
     *         in="query",
     *         description="Name of the property",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="attribute_id",
     *         in="query",
     *         description="Attribute ID",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     )
     * )
     */
    public function list(Request $request)
    {
        $name = $request->input('name');
        $attribute_id = $request->input('attribute_id');

        $properties = Properties::where('properties.status', '!=', PropertyStatus::DELETED)
            ->orderBy('properties.id', 'desc')
            ->join('attributes', 'properties.attribute_id', '=', 'attributes.id')
            ->where('attributes.status', '!=', AttributeStatus::DELETED);

        if ($name) {
            $properties = $properties->where('properties.name', 'like', '%' . $name . '%');
        }

        if ($attribute_id) {
            $properties = $properties->where('properties.attribute_id', $attribute_id);
        }

        $properties = $properties->select('properties.*', 'attributes.name as attribute_name')->get();
        $data = returnMessage(1, $properties, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * Get detail of a property
     *
     * @OA\Get(
     *     path="/api/properties/detail/{id}",
     *     summary="Get detail of a property",
     *     description="Get detail of a property",
     *     tags={"Property"},
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
     *         response=404,
     *         description="Property not found"
     *     )
     * )
     */
    public function detail($id)
    {
        $property = Properties::where('id', $id)
            ->where('status', '=', PropertyStatus::DELETED)
            ->first();

        if (!$property) {
            $data = returnMessage(-1, null, 'Property not found!');
            return response()->json($data, 404);
        }

        $data = returnMessage(1, $property, 'Success!');
        return response()->json($data, 200);
    }
}
