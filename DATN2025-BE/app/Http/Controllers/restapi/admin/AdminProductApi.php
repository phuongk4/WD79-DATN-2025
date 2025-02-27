<?php

namespace App\Http\Controllers\restapi\admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Api;
use App\Models\Attributes;
use App\Models\ProductOptions;
use App\Models\Products;
use App\Models\Properties;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminProductApi extends Api
{

    /**
     * @OA\Get(
     *     path="/api/admin/products/list",
     *     tags={"Admin Product"},
     *     summary="Get list of products",
     *     description="Get list of products",
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
        $products = Products::where('status', '!=', ProductStatus::DELETED)
            ->orderBy('id', 'desc')
            ->get();
        $data = returnMessage(1, $products, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * Get detail of a product
     *
     * @OA\Get(
     *     path="/api/admin/products/detail/{id}",
     *     tags={"Admin Product"},
     *     summary="Get detail of a product",
     *     description="Get detail of a product",
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
    public function detail(Request $request, $id)
    {
        $product = Products::find($id);
        if (!$product || $product->status == ProductStatus::DELETED) {
            $data = returnMessage(-1, null, 'Product not found!');
            return response()->json($data, 404);
        }

        $product = $product->toArray();

        $product_option = ProductOptions::where('product_id', $id)
            ->cursor()
            ->map(function ($item) {
                $option_item = $item->toArray();

                $options = $item->value;
                $options = json_decode($options, true);

                $data = [];
                foreach ($options as $key => $option) {
                    $ite = [];

                    $attribute = Attributes::find($option['attribute_item']);
                    $property = Properties::find($option['property_item']);

                    $ite['attribute_item'] = $attribute;
                    $ite['property_item'] = $property;

                    $data[] = $ite;
                }

                $option_item['options'] = $data;
                return $option_item;
            });

        $product['options'] = $product_option;
        $data = returnMessage(1, $product, 'Success!');
        return response()->json($data, 200);
    }

    /**
     * Create a product
     *
     * @OA\Post(
     *     path="/api/admin/products/create",
     *     tags={"Admin Product"},
     *     summary="Create product",
     *     description="Create a new product",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(
     *                     property="name",
     *                     type="string",
     *                     description="Name of the product",
     *                     example="Sample Product"
     *                 ),
     *                 @OA\Property(
     *                     property="short_description",
     *                     type="string",
     *                     description="Short description of the product",
     *                     example="This is a short description."
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string",
     *                     description="Detailed description of the product",
     *                     example="This is a detailed description of the product."
     *                 ),
     *                 @OA\Property(
     *                     property="parent_id",
     *                     type="integer",
     *                     description="Category ID for the product",
     *                     example=1
     *                 ),
     *                 @OA\Property(
     *                     property="thumbnail",
     *                     type="string",
     *                     format="binary",
     *                     description="Thumbnail image of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="gallery",
     *                     type="array",
     *                     @OA\Items(
     *                         type="string",
     *                         format="binary"
     *                     ),
     *                     description="Gallery images of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="price",
     *                     type="number",
     *                     format="float",
     *                     description="Price of the product",
     *                     example=19.99
     *                 ),
     *                 @OA\Property(
     *                     property="sale_price",
     *                     type="number",
     *                     format="float",
     *                     description="Sale price of the product",
     *                     example=14.99
     *                 ),
     *                 @OA\Property(
     *                     property="quantity",
     *                     type="integer",
     *                     description="Quantity of the product",
     *                     example=100
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="integer",
     *                     enum={1, 2, 3},
     *                     description="Status of the product (e.g., available, out of stock)",
     *                     example=1
     *                 ),
     *                  @OA\Property(
     *                      property="data_options",
     *                      type="array",
     *                      description="The options of the product",
     *                      @OA\Items(
     *                          type="object",
     *                          @OA\Property(
     *                              property="quantity",
     *                              type="integer",
     *                              description="The quantity of the option",
     *                          ),
     *                          @OA\Property(
     *                              property="price",
     *                              type="number",
     *                              description="The price of the option",
     *                              format="float"
     *                          ),
     *                          @OA\Property(
     *                              property="sale_price",
     *                              type="number",
     *                              description="The sale price of the option",
     *                              format="float"
     *                          ),
     *                          @OA\Property(
     *                              property="description",
     *                              type="string",
     *                              description="The description of the option",
     *                          ),
     *                          @OA\Property(
     *                              property="data_images",
     *                              type="array",
     *                              description="The images of the option",
     *                              @OA\Items(
     *                                  type="string",
     *                                  format="binary"
     *                              )
     *                          ),
     *                          @OA\Property(
     *                              property="_options",
     *                              type="array",
     *                              description="The values of the option",
     *                              @OA\Items(
     *                                  type="string"
     *                              )
     *                          ),
     *                      )
     *                  ),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input data"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function create(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();
            $user_id = $user['id'];

            $product = new Products();

            $category_id = $request->input('category_id');

            if (!$category_id) {
                $data = returnMessage(-1, $product, 'Error, Please select category!');
                return response()->json($data, 400);
            }

            if (!$request->hasFile('thumbnail')) {
                $data = returnMessage(-1, $product, 'Error, Please upload thumbnail!');
                return response()->json($data, 400);
            }

            $product = $this->save($product, $request);
            $product->created_by = $user_id;

            $success = $product->save();

            $data_options = $request->input('data_options');

            $data_options = json_decode($data_options, true);

            $quantity_m = 0;

            $index = 0;
            foreach ($data_options as $data_option) {
                $data_values = json_encode($data_option['_options'], JSON_THROW_ON_ERROR);

                $product_option = ProductOptions::where('product_id', $product->id)->where('value', $data_values)->first();

                $quantity = $data_option['quantity'];
                $price = $data_option['price'];
                $sale_price = $data_option['sale_price'];
                $description = $data_option['description'];

                $thumbnail = $product->thumbnail;

//                if ($request->hasFile('data_images')) {
//                    $data_images = $request->file('data_images');
//                    $image = $data_images[$index];
//                    $itemPath = $image->store('product', 'public');
//                    $thumbnail = asset('storage/' . $itemPath);
//                }

                if ($product_option) {
                    $product_option->quantity = (integer)$product_option->quantity + (integer)$quantity;
                } else {
                    $product_option = new ProductOptions();
                    $product_option->quantity = $quantity;
                }

                $product_id = $product->id;

                $product_option->product_id = $product_id;
                $product_option->user_id = $user_id;
                $product_option->price = $price;
                $product_option->sale_price = $sale_price;
                $product_option->description = $description;
                $product_option->thumbnail = $thumbnail;
                $product_option->value = $data_values;

                $product_option->save();
                $quantity_m += $product_option->quantity;
                $index++;
            }

            $product->quantity = $quantity_m;
            $success = $product->save();

            if ($success) {
                $data = returnMessage(1, $product, 'Success, Create product successful!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, $product, 'Error, Create error!');
            return response()->json($data, 400);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, $product, $exception->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * Update a product
     *
     * @OA\Put(
     *     path="/api/admin/products/update/{id}",
     *     tags={"Admin Product"},
     *     summary="Update product",
     *     description="Update an existing product",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Product ID",
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
     *                     description="Name of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="short_description",
     *                     type="string",
     *                     description="Short description of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string",
     *                     description="Detailed description of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="parent_id",
     *                     type="integer",
     *                     description="Category ID"
     *                 ),
     *                 @OA\Property(
     *                     property="thumbnail",
     *                     type="file",
     *                     format="binary",
     *                     description="Thumbnail image of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="gallery",
     *                     type="array",
     *                     @OA\Items(
     *                         type="string",
     *                         format="binary"
     *                     ),
     *                     description="Gallery images of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="price",
     *                     type="number",
     *                     format="float",
     *                     description="Price of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="sale_price",
     *                     type="number",
     *                     format="float",
     *                     description="Sale price of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="quantity",
     *                     type="integer",
     *                     description="Quantity of the product"
     *                 ),
     *                 @OA\Property(
     *                     property="status",
     *                     type="integer",
     *                     enum={1, 2, 3},
     *                     description="Status of the product (e.g., available, out of stock)"
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
     *         description="Unauthorized"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Product not found"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();
            $user_id = $user['id'];

            $product = Products::find($id);

            $product = $this->save($product, $request);

            $success = $product->save();


            $product_option = ProductOptions::where('product_id', $product->id)->delete();

            $data_options = $request->input('data_options');

            $data_options = json_decode($data_options, true);

            $quantity_m = 0;
            $index = 0;
            foreach ($data_options as $data_option) {
                $data_values = json_encode($data_option['_options'], JSON_THROW_ON_ERROR);

                $product_option = ProductOptions::where('product_id', $product->id)->where('value', $data_values)->first();

                $quantity = $data_option['quantity'];
                $price = $data_option['price'];
                $sale_price = $data_option['sale_price'];
                $description = $data_option['description'];
//                $thumbnail_uploaded = isset($data_option['thumbnail_uploaded']) ? $data_option['thumbnail_uploaded'] : '';

                $thumbnail = $product->thumbnail;

//                if ($request->hasFile('data_images')) {
//                    $data_images = $request->file('data_images');
//                    $image = isset($data_images[$index]) ? $data_images[$index] : null;
//                    if ($image != null) {
//                        $itemPath = $image->store('product', 'public');
//                        $thumbnail = asset('storage/' . $itemPath);
//                    }
//                }

                if ($product_option) {
                    $product_option->quantity = (integer)$product_option->quantity + (integer)$quantity;
                } else {
                    $product_option = new ProductOptions();
                    $product_option->quantity = $quantity;
                }

                $product_id = $product->id;

                $product_option->product_id = $product_id;
                $product_option->user_id = $user_id;
                $product_option->price = $price;
                $product_option->sale_price = $sale_price;
                $product_option->description = $description;
                $product_option->thumbnail = $thumbnail;
                $product_option->value = $data_values;

                $product_option->save();

                $quantity_m += $product_option->quantity;
                $index++;
            }

            $product->quantity = $quantity_m;
            $success = $product->save();

            if ($success) {
                $data = returnMessage(1, $product, 'Success, Update product successful!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, $product, 'Error, Update error!');
            return response()->json($data, 400);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, $product, $exception->getMessage());
            return response()->json($data, 400);
        }
    }

    /**
     * Save a product
     *
     * @param Products $product
     * @param Request $request
     * @return Products
     */
    private function save(Products $product, Request $request)
    {
        $name = $request->input('name');
        $product->name = $name;

        $short_description = $request->input('short_description');
        $product->short_description = $short_description;

        $description = $request->input('description');
        $product->description = $description;

        $category_id = $request->input('category_id');

        if ($category_id) {
            $product->category_id = $category_id;
        }

        if ($request->hasFile('thumbnail')) {
            $item = $request->file('thumbnail');
            $itemPath = $item->store('product', 'public');
            $thumbnail = asset('storage/' . $itemPath);
            $product->thumbnail = $thumbnail;
        }

        if ($request->hasFile('gallery')) {
            $galleryPaths = array_map(function ($image) {
                $itemPath = $image->store('product', 'public');
                return asset('storage/' . $itemPath);
            }, $request->file('gallery'));
            $gallery = implode(',', $galleryPaths);
        } else {
            $gallery = $product->gallery;
        }
        $product->gallery = $gallery;

        $product->price = $request->input('price');
        $product->sale_price = $request->input('sale_price');

        $product->quantity = $request->input('quantity');

        $product->status = $request->input('status');
        $product->updated_by = Auth::user()->id;
        $product->updated_at = Carbon::now()->addHours(7); /* GMT +7*/

        return $product;
    }

    /**
     * Delete a product
     *
     * @OA\Delete(
     *     path="/api/admin/products/delete/{id}",
     *     tags={"Admin Product"},
     *     summary="Delete a product",
     *     description="Delete a product",
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
     *         response="401",
     *         description="Unauthorized user"
     *     )
     * )
     */
    public function delete($id)
    {
        try {
            $product = Products::find($id);

            $product->status = ProductStatus::DELETED;
            $product->deleted_by = Auth::user()->id;
            $product->deleted_at = Carbon::now()->addHours(7); /* GMT +7*/

            $success = $product->save();

            if ($success) {
                $data = returnMessage(1, $product, 'Success, Delete product successful!');
                return response()->json($data, 200);
            }

            $data = returnMessage(-1, $product, 'Error, Delete error!');
            return response()->json($data, 400);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, $product, $exception->getMessage());
            return response()->json($data, 400);
        }
    }

    private function getArray($array)
    {
        if ($array) {
            if (count($array) == 1) {
                return $array;
            }
            $newArray = $array[0];
            for ($i = 1; $i < count($array); $i++) {
                $newArray = $this->mergeArray($newArray, $array[$i]);
            }
            return $newArray;
        } else {
            return null;
        }
    }

    private function mergeArray($array1, $array2)
    {
        $arrayList = [];
        for ($j = 0; $j < count($array1); $j++) {
            for ($z = 0; $z < count($array2); $z++) {
                $arrayList[] = $array1[$j] . "," . $array2[$z];
            }
        }
        return $arrayList;
    }

    public function getDataToModalAtt($productID)
    {

    }

    private function saveData()
    {

    }
}
