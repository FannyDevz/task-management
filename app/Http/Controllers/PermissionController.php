<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\PermissionList;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index( Request $request) {
        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? ''
        ];
        $query = UserRole::with('permissions')->where('id', '!=', 1);


        $permissions = PermissionList::get();
        if ($request->search) {
            $query = $query->where('name', 'like', '%' . $request->search . '%');
        }

        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);

        return Inertia::render('Permissions/Index', [
            'results' => $results,
            'option' => $option,
            'permissions' => $permissions,
        ]);
    }
    public function update(Request $request ,  UserRole $role)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permission_lists,id',
        ]);
        try {
            $role->permissions()->sync($request->permissions);
            $role->save();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Permission updated successfully',
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }

    }
}
