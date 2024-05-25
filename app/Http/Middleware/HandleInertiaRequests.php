<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = null;
        if ($user) {
            $role = $user->role;
            if ($role) {
                $permissions = $role->permissions->pluck('cid');
            }
        }

        $settings = Setting::pluck( 'value','key');
        return array_merge(parent::share($request), [
            'settings' => $settings,
            'user_auth' => $user ?? null,
            'user_permissions' => $permissions ?? [],
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
        ]);
    }
}
