<?php

namespace App\Http\Middleware\api;

use App\Enums\RoleName;
use App\Models\Role;
use App\Models\RoleUser;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckAdminPermission
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $role_user = RoleUser::where('user_id', $user->id)->first();
            $roleNames = Role::where('id', $role_user->role_id)->pluck('name');
            if ($roleNames->contains(RoleName::ADMIN)) {
                return $next($request);
            }
        } catch (TokenInvalidException $e) {
            return response(['status' => 'Vui lòng đăng nhập'], 403);
        } catch (TokenExpiredException $e) {
            return response(['status' => 'Hết hạn đăng nhập!'], 403);
        } catch (Exception $e) {
            return response(['status' => 'Thất bại, vui lòng thử lại'], 401);
        }
        return response(['status' => 'Bị cấm: Bạn không có quyền truy cập [thư mục] trên máy chủ này'], 403);
    }
}
