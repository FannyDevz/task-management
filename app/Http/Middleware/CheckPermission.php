<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->role->slug === 'admin') {
                return $next($request);
            }
            if ($user->role->permissions->contains('cid', $permission)) {
                return $next($request);
            }
        }
        return redirect()->back()
            ->with('message', [
                'type' => 'error',
                'text' => 'You do not have permission to access this menu',
            ]);
    }
}
