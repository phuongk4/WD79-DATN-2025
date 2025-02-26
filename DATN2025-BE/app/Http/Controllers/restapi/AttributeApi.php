<?php

namespace App\Http\Controllers\restapi;

use App\Enums\AttributeStatus;
// use App\Enums\ProductStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Attributes;
use App\Models\Properties;
// use App\Models\Products;
// use App\Models\Properties;
use OpenApi\Annotations as OA;

class AttributeApi extends Api
{

    /**
     * @OA\Get(
     *     path="/api/attributes/list",
     *     summary="Get list of attributes",
     *     description="Get list of attributes",
     *     tags={"Attribute"},
     *     @OA\Response(
     *         response=200,
     *         description="successful operation"
     *     )
     * )
     */
    public function list()
    {
        $attributes = Attributes::where('status', AttributeStatus::ACTIVE)
            ->orderByDesc('id')
            ->cursor()
            ->map(function ($item) {
                $attribute = $item->toArray();

                $properties = Properties::where('attribute_id', $item->id)
                    ->orderByDesc('id')
                    ->get();

                $attribute['properties'] = $properties->toArray();

                return $attribute;
            });
        $data = returnMessage(1, $attributes, 'Success');
        return response($data, 200);
    }
}
