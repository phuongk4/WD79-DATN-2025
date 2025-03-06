<?php

namespace App\Http\Controllers\restapi;

use App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserApi extends Api
{
    /**
     * @OA\Get(
     *     path="/api/auth/users/get-info",
     *     summary="Get user information from token",
     *     description="Get user information from token",
     *     tags={"Users Api"},
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
    public function getUserFromToken()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $data = $user->toArray();

            $res = returnMessage(1, $data, 'Success!');

            return response()->json($res, 200);
        } catch (TokenInvalidException $e) {
            $res = returnMessage(-1, null, 'Vui lòng đăng nhập!');
            return response()->json($res, 400);
        } catch (TokenExpiredException $e) {
            $res = returnMessage(-1, null, 'Hết hạn đăng nhập!!');
            return response()->json($res, 400);
        } catch (\Exception $e) {
            $res = returnMessage(-1, null, 'Thất bại, vui lòng thử lại!');
            return response()->json($res, 401);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/auth/users/update-info",
     *     summary="Update user information",
     *     description="Update user information",
     *     tags={"Users Api"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Send user information",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="full_name", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="email", type="string", example="nguyenvana@gmail.com"),
     *             @OA\Property(property="phone", type="string", example="0909090909"),
     *             @OA\Property(property="address", type="string", example="Ha Noi"),
     *             @OA\Property(property="about", type="string", example="abc"),
     *             @OA\Property(property="avatar", type="string", format="binary", example="avatar.jpg")
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
     *         description="Invalid request"
     *     )
     * )
     */
    public function updateInfo(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();

            $full_name = $request->input('full_name');
            $email = $request->input('email');
            $phone = $request->input('phone');
            $address = $request->input('address');
            $about = $request->input('about');

            $avt = $user['avt'];

            if ($request->hasFile('avatar')) {
                $item = $request->file('avatar');
                $itemPath = $item->store('avatars', 'public');
                $avt = asset('storage/' . $itemPath);
            }

            $user = User::find($user['id']);
            $user->full_name = $full_name;

            if ($user->email != $email) {

                $isEmail = filter_var($email, FILTER_VALIDATE_EMAIL);
                if (!$isEmail) {
                    $data = returnMessage(-1, '', 'Invalid email!');
                    return response($data, 400);
                }

                $isValid = User::checkEmail($email);
                if (!$isValid) {
                    $data = returnMessage(-1, '', 'Email already exists!');
                    return response($data, 400);
                }
                $user->email = $email;
            }

            if ($user->phone != $phone) {
                $isValid = User::checkPhone($phone);
                if (!$isValid) {
                    $data = returnMessage(-1, '', 'Phone already exists!');
                    return response($data, 400);
                }
                $user->phone = $phone;
            }
            $user->address = $address;
            $user->about = $about;
            $user->avt = $avt;

            $user->save();

            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    /**
     * @OA\Post(
     *     path="/user/change_password",
     *     tags={"User"},
     *     summary="Change password",
     *     description="Change password",
     *     @OA\RequestBody(
     *         description="User info",
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="password", type="string", example="123456"),
     *             @OA\Property(property="password_confirm", type="string", example="123456")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request"
     *     )
     * )
     */
    public function changePassword(Request $request)
    {
        try {
            $password = $request->input('password');
            $password_confirm = $request->input('newpassword');
            $new_password_confirm = $request->input('renewpassword');

            $user = JWTAuth::parseToken()->authenticate();
            $user = $user->toArray();

            $user = User::find($user['id']);

            if (!Hash::check($password, $user->password)) {
                $data = returnMessage(-1, '', 'Old password not match!');
                return response($data, 400);
            }

            if ($new_password_confirm != $password_confirm) {
                $data = returnMessage(-1, '', 'Password not match!');
                return response($data, 400);
            }

            if (strlen($password_confirm) < 5) {
                $data = returnMessage(-1, '', 'Password must be at least 5 characters!');
                return response($data, 400);
            }

            $passwordHash = Hash::make($password_confirm);
            $user->password = $passwordHash;
            $user->save();

            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}
