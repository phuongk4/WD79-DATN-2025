<?php

namespace App\Http\Controllers\restapi;

use App\Enums\ProductStatus;
use App\Http\Controllers\Api;
use App\Models\Attributes;
use App\Models\ProductOptions;
use App\Models\Products;
use App\Models\Properties;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class ProductApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/products/list",
     *     summary="Get list of products",
     *     description="Get list of products",
     *     tags={"Product"},
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

        $category_id = $request->input('category');
        $size = $request->input('size');
        $sort = $request->input('sort') ?? 'desc';
        $order_by = $request->input('order') ?? 'id';
        $min_price = $request->input('minPrice');
        $max_price = $request->input('maxPrice');
        $keyword = $request->input('keyword');

        $products = Products::where('products.status', ProductStatus::ACTIVE)
            ->join('product_options', 'product_options.product_id', '=', 'products.id')
            ->when($category_id, function ($query) use ($category_id) {
                $query->where('products.category_id', $category_id);
            })
            ->when($min_price, function ($query) use ($min_price) {
                $query->where('products.sale_price', '>=', $min_price);
            })
            ->when($max_price, function ($query) use ($max_price) {
                $query->where('products.sale_price', '<=', $max_price);
            })
            ->when($keyword, function ($query) use ($keyword) {
                $query->where('products.name', 'like', '%' . $keyword . '%');
            })
            ->orderBy('products.' . $order_by, $sort);

        if ($size) {
            $products->limit((int)$size);
        }

        $products = $products->select('products.*')->distinct()->get();
        $data = returnMessage(1, $products, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * @OA\Get(
     *     path="/api/products/detail/{id}",
     *     summary="Get detail of a product",
     *     description="Get detail of a product",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         description="Product ID",
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
     *         description="Product not found"
     *     )
     * )
     */
    public function detail($id)
    {
        $product = Products::find($id);
        if (!$product || $product->status != ProductStatus::ACTIVE) {
            $data = returnMessage(-1, null, 'Product not found!');
            return response()->json($data, 404);
        }

        $products = Products::where('status', ProductStatus::ACTIVE)
            ->where('id', '!=', $id)
            ->where('category_id', $product->category_id)
            ->orderByDesc('id')
            ->get();


        $product_options = ProductOptions::where('product_id', $product->id)->get();

        $array_value = [];
        foreach ($product_options as $option) {
            $op = $option->value;

            $array_value[] = json_decode($op, true);
        }

        $ops = $this->mergeOption($array_value);

        $product = $product->toArray();

        $product['list_options'] = $product_options->toArray();
        $product['options'] = $ops;

        $data = [
            'product' => $product,
            'other_products' => $products
        ];

        $res = returnMessage(1, $data, 'Success!');
        return response()->json($res, 200);
    }

    /**
     * Merge an array of option values into a grouped array
     *
     * @param array $array_value an array of option values
     *
     * @return array a grouped array of options
     */
    private function mergeOption($array_value)
    {
        $n = count($array_value);
        $result = [];
        if ($n == 0) {
            return $result;
        }

        foreach ($array_value as $value) {

            foreach ($value as $key => $item) {
                $attribute_id = $item['attribute_item'];
                $property_id = $item['property_item'];

                $attribute = Attributes::find($attribute_id);
                $property = Properties::find($property_id);

                if (!$attribute || !$property) {
                    break;
                }

                $attribute_name = $attribute->name;
                $property_name = $property->name;

                if (!isset($result[$attribute_name])) {
                    $result[$attribute_name] = [
                        "attribute" => $attribute->toArray(),
                        "properties" => []
                    ];
                }


                $result[$attribute_name]['properties'][] = $property->toArray();

                $properties = $result[$attribute_name]['properties'];

//                $properties = array_unique($properties, SORT_REGULAR);
                $cleanArray = $this->removeDuplicates($properties);
                $result[$attribute_name]['properties'] = $cleanArray;
            }
        }

        foreach ($result as $group) {
            sort($group['properties']);
        }

        $result = array_values($result);
        return $result;
    }

    private function removeDuplicates($array)
    {
        $unique = [];
        foreach ($array as $item) {
            $unique[$item['id']] = $item;
        }
        return array_values($unique);
    }

    public function getInfo(Request $request)
    {
        $product_id = $request->input('id');
        $value = $request->input('op');

        $product = Products::find($product_id);

        if (!$product || $product->status != ProductStatus::ACTIVE) {
            $data = returnMessage(-1, null, 'Product not found!');
            return response()->json($data, 404);
        }

        $product_option = ProductOptions::where('product_id', $product_id);
        $arr_value = explode(',', $value);

        foreach ($arr_value as $property) {
            $product_option->whereJsonContains('value', ['property_item' => $property]);
        }

        $product_option = $product_option->first();

        $res = returnMessage(1, $product_option, 'Success!');
        return response()->json($res, 200);
    }

//    public function getInfo(Request $request)
//    {
//        $product_id = $request->input('product_id');
//        $value = $request->input('value');
//
//        $product = Products::find($product_id);
//
//        if (!$product || $product->status != ProductStatus::ACTIVE) {
//            $data = returnMessage(-1, null, 'Product not found!');
//            return response()->json($data, 404);
//        }
//
//        $product_option = ProductOptions::where('product_id', $product->id)->where('value', $value)->first();
//
//        $op = $product_option->value;
//
//        $array_value[] = json_decode($op, true);
//
//        $ops = $this->mergeOption($array_value);
//
//        $product = $product->toArray();
//
//        $product['list_options'] = $product_option->toArray();
//        $product['options'] = $ops;
//
//        $res = returnMessage(1, $product, 'Success!');
//        return response()->json($res, 200);
//    }

    /**
     * @OA\Get(
     *     path="/api/products/search",
     *     summary="Search products",
     *     description="Search products",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         description="Category ID",
     *         in="query",
     *         name="category_id",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Minimum price",
     *         in="query",
     *         name="min_price",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Maximum price",
     *         in="query",
     *         name="max_price",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Keyword",
     *         in="query",
     *         name="keyword",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *          description="Option",
     *          in="query",
     *          name="option",
     *          required=false,
     *          @OA\Schema(
     *              type="string"
     *          )
     *      ),
     *     @OA\Parameter(
     *         description="Size",
     *         in="query",
     *         name="size",
     *         required=false,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Sort",
     *         in="query",
     *         name="sort",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Order by",
     *         in="query",
     *         name="order_by",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
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
    public function search(Request $request)
    {
        $category_id = $request->input('category');
        $size = $request->input('size');
        $sort = $request->input('sort') ?? 'desc';
        $order_by = $request->input('order') ?? 'id';
        $min_price = $request->input('minPrice');
        $max_price = $request->input('maxPrice');
        $keyword = $request->input('keyword');
        $option = $request->input('option');

        $products = Products::where('products.status', ProductStatus::ACTIVE)
            ->join('product_options', 'product_options.product_id', '=', 'products.id')
            ->when($category_id, function ($query) use ($category_id) {
                $query->where('products.category_id', $category_id);
            })
            ->when($min_price, function ($query) use ($min_price) {
                $query->where('products.sale_price', '>=', $min_price);
            })
            ->when($max_price, function ($query) use ($max_price) {
                $query->where('products.sale_price', '<=', $max_price);
            })
            ->when($keyword, function ($query) use ($keyword) {
                $query->where('products.name', 'like', '%' . $keyword . '%');
            })
            ->when($option, function ($query) use ($option) {
                $arr_option = explode(',', $option);

                $query->where(function ($query) use ($arr_option) {
                    foreach ($arr_option as $op) {
                        $query->orWhereJsonContains('product_options.value', ['property_item' => $op]);
                    }
                });
            })
            ->orderBy('products.' . $order_by, $sort);

        if ($size) {
            $products->limit((int)$size);
        }

        $products = $products->select('products.*')->distinct()->get();

        return response()->json(returnMessage(1, $products, 'Success!'), 200);
    }
}
