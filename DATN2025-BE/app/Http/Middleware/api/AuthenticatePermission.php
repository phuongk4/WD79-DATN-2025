<?php

namespace App\Http\Middleware\api;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticatePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenInvalidException $e) {
            return response(['status' => 'Vui lòng đăng nhập'], 400);
        } catch (TokenExpiredException $e) {
            return response(['status' => 'Hết hạn đăng nhập!'], 444);
        } catch (Exception $e) {
            return response(['status' => 'Thất bại, vui lòng thử lại'], 401);
        }
        return $next($request);
    }
}
