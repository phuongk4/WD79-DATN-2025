<?php

namespace App\Http\Controllers\restapi;

use App\Enums\UserStatus;
use App\Http\Controllers\Api;
use App\Http\Controllers\MainController;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthApi extends Api
{
    /**
     * @OA\Post(
     *     path="/auth/login",
     *     summary="User login",
     *     description="User login",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         description="User login info",
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login_request", "password"},
     *             @OA\Property(property="login_request", type="string", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="Passw0rd"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="full_name", type="string", example="Nguyen Van A"),
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="phone", type="string", example="123456789"),
     *             @OA\Property(property="role", type="string", example="admin"),
     *             @OA\Property(property="accessToken", type="string", example="abcxyz1234567890"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Th  t b i, Vui l ng ki m tra l i t i kho n ho c m t kh u!"),
     *         ),
     *     ),
     * )
     */
    public function login(Request $request)
    {
        $newController = (new MainController());
        try {
            $loginRequest = $request->input('login_request');
            $password = $request->input('password');

            $credentials = [
                'password' => $password,
            ];

            if (filter_var($loginRequest, FILTER_VALIDATE_EMAIL)) {
                $credentials['email'] = $loginRequest;
            } else {
                $credentials['phone'] = $loginRequest;
            }

            $user = User::where('email', $loginRequest)->orWhere('phone', $loginRequest)->first();
            if (!$user) {
                return response($newController->returnMessage('Không tìm thấy tài khoản!'), 404);
            }
            if ($user->status == UserStatus::INACTIVE) {
                return response($newController->returnMessage('Tài khoản chưa được kích hoạt!'), 400);
            }

            if ($user->status == UserStatus::BLOCKED) {
                return response($newController->returnMessage('Tài khoản đã bị khoá!'), 400);
            }

            if ($user->status == UserStatus::DELETED) {
                return response($newController->returnMessage('Tài khoản đã bị xoá!'), 400);
            }

            if (Auth::attempt($credentials)) {
                $token = JWTAuth::fromUser($user);
                $user->save();

                $response = $user->toArray();
                $roleUser = RoleUser::where('user_id', $user->id)->first();
                $role = Role::find($roleUser->role_id);
                $response['role'] = $role->name;
                $response['accessToken'] = $token;
                return response()->json($response);
            }
            return response()->json($newController->returnMessage('Thất bại, Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!'), 400);
        } catch (\Exception $exception) {
            return response($newController->returnMessage($exception->getMessage()), 400);
        }
    }

    /**
     * Register a new user.
     *
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Register a new user",
     *     description="Register a new user",
     *     tags={"Auth"},
     *     @OA\Parameter(
     *         description="Name",
     *         in="query",
     *         name="name",
     *         required=false,
     *         example="Nguyen Van A",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Email",
     *         in="query",
     *         name="email",
     *         required=true,
     *         example="user1@example.com",
     *         @OA\Schema(
     *             type="string",
     *             format="email"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Phone",
     *         in="query",
     *         name="phone",
     *         required=true,
     *         example="123456789",
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Password",
     *         in="query",
     *         name="password",
     *         required=true,
     *         example="123456",
     *         @OA\Schema(
     *             type="string",
     *             format="password"
     *         )
     *     ),
     *     @OA\Parameter(
     *         description="Password confirm",
     *         in="query",
     *         name="password_confirm",
     *         required=true,
     *         example="123456",
     *         @OA\Schema(
     *             type="string",
     *             format="password"
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad Request",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Th  t b i, Vui l ng ki m tra l i t i kho n ho c m t kh u!"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Thành công, Vui lòng kiểm tra email!"),
     *         ),
     *     ),
     * )
     */
    public function register(Request $request)
    {
        $newController = (new MainController());
        try {
            $name = $request->input('name');
            $email = $request->input('email');
            $phone = $request->input('phone');
            $password = $request->input('password');
            $password_confirm = $request->input('password_confirm');

            $isEmail = filter_var($email, FILTER_VALIDATE_EMAIL);
            if (!$isEmail) {
                return response($newController->returnMessage('Email không hợp lệ!'), 400);
            }

            $is_valid = User::checkEmail($email);
            if (!$is_valid) {
                return response($newController->returnMessage('Email đã được sử dụng!'), 400);
            }

            $is_valid = User::checkPhone($phone);
            if (!$is_valid) {
                return response($newController->returnMessage('Số điện thoại đã được sử dụng!'), 400);
            }

            if ($password != $password_confirm) {
                return response($newController->returnMessage('Mật khẩu và mật khẩu xác nhận không chính xác!'), 400);
            }

            if (strlen($password) < 5) {
                return response($newController->returnMessage('Mật khẩu không hợp lệ!'), 400);
            }

            $passwordHash = Hash::make($password);

            $user = new User();

            $user->full_name = $name ?? '';
            $user->phone = $phone;
            $user->email = $email;
            $user->password = $passwordHash;

            $user->address = '';
            $user->about = '';

            $user->status = UserStatus::ACTIVE;

            $success = $user->save();

            $newController->saveRoleUser($user->id);

            if ($success) {
                return response($newController->returnMessage('Đăng ký thành công!'), 200);
            }
            return response($newController->returnMessage('Đăng ký thất bại!'), 400);
        } catch (\Exception $exception) {
            return response($newController->returnMessage($exception->getMessage()), 400);
        }
    }

    /**
     * @OA\Post(
     *     path="/auth/forgot_password",
     *     summary="Forgot password",
     *     description="Forgot password",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         description="User info",
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="email", type="string", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example=1),
     *             @OA\Property(property="message", type="string", example="Success")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="integer", example=-1),
     *             @OA\Property(property="message", type="string", example="User not found!")
     *         )
     *     )
     * )
     */
    public function forgotPassword(Request $request)
    {
        try {
            $email = $request->input('email');

            $code = (new MainController())->generateRandomNumber(6);

            $user = User::where('email', $email)->first();

            if (!$user) {
                $data = returnMessage(-1, '', 'User not found!');
                return response($data, 400);
            }

            $user->verify_code = $code;
            $user->verify_code_expire = Carbon::now()->addMinutes(5);
            $user->is_verify = false;

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
     *     path="/auth/change_password",
     *     summary="Update password",
     *     description="Update password",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="User info",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="email", type="string", example="nguyenvana@gmail.com"),
     *             @OA\Property(property="code", type="string", example="123456"),
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
            $email = $request->input('email');
            $code = $request->input('code');
            $password = $request->input('password');
            $password_confirm = $request->input('password_confirm');

            $user = User::where('email', $email)->first();

            if (!$user) {
                $data = returnMessage(-1, '', 'User not found!');
                return response($data, 400);
            }

            if ($code != $user->verify_code) {
                $data = returnMessage(-1, '', 'Code not match!');
                return response($data, 400);
            }

            if ($password != $password_confirm) {
                $data = returnMessage(-1, '', 'Password not match!');
                return response($data, 400);
            }

            if (strlen($password) < 5) {
                $data = returnMessage(-1, '', 'Password must be at least 5 characters!');
                return response($data, 400);
            }

            $passwordHash = Hash::make($password);
            $user->password = $passwordHash;

            $user->verify_code = null;
            $user->verify_code_expire = null;
            $user->is_verify = true;

            $user->save();

            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }

    public function logout()
    {
        try {
            $data = returnMessage(1, '', 'Success');
            return response($data, 200);
        } catch (\Exception $exception) {
            $data = returnMessage(-1, '', $exception->getMessage());
            return response($data, 400);
        }
    }
}