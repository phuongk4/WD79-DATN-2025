<?php

namespace App\Http\Controllers\restapi;

use App\Enums\CategoryStatus;
use App\Enums\ProductStatus;
use App\Http\Controllers\Api;
use App\Models\Attributes;
use App\Models\Categories;
use App\Models\Products;
use App\Models\Properties;

class CategoryApi extends Api
{
    public function list()
    {

        $categories = Categories::where('status', CategoryStatus::ACTIVE)
            ->where('parent_id', null)
            ->orderByDesc('id')
            ->cursor()
            ->map(function ($item) {
                $category = $item->toArray();
                $products = Products::where('category_id', $item->id)->where('status', ProductStatus::ACTIVE)->get();
                $category['count'] = $products->count();
                $category['products'] = $products->toArray();
                return $category;
            });

        $data = returnMessage(1, $categories, 'Success!');
        return response()->json($data, 200);
    }
}
