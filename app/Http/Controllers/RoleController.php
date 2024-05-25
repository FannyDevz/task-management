<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request){
        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? ''
        ];
        $query = UserRole::where('id', '!=', 1);

        if ($request->search) {
            $query = $query->where('name', 'like', '%' . $request->search . '%');
        }

        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);

        return Inertia::render('Roles/Index', [
            'results' => $results,
            'option' => $option
        ]);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'slug' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $role = new UserRole();
            $role->slug = $request->slug;
            $role->name = $request->name;
            $role->save();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Role Created',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'slug' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $role = UserRole::find($id);
            if ($role == null || $role->id == 1) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Role Not Found',
                ]);
            }
            $role->update([
                'slug' => $request->slug,
                'name' => $request->name,
            ]);

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Role Updated',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }

    public function delete($id){
        try {
            $role = UserRole::find($id);
            if ($role == null || $role->id == 1) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Role Not Found',
                ]);
            }
            $role->delete();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Role Deleted',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }
}
