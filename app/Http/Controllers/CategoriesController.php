<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\UserRole;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index(Request $request){

        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? ''
        ];
        $query = Category::with('roles');

        if ($request->search) {
            $query = $query->where('name', 'like', '%' . $request->search . '%');
            $query = $query->where('info', 'like', '%' . $request->search . '%');
            $query = $query->where('default_point', 'like', '%' . $request->search . '%');
        }
        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);

        $roles = UserRole::all();

        return Inertia::render('Categories/Index', [
            'results' => $results,
            'option' => $option,
            'roles' => $roles
        ]);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'default_point' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $category = new Category();
            $category->name = $request->name;
            $category->info = $request->info;
            $category->default_point = $request->default_point;
            $category->save();

            $category->roles()->sync($request->roles);

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Category Created',
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
            'name' => 'required',
            'default_point' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $category = Category::find($id);
            if ($category == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Category Not Found',
                ]);
            }
            $category->update([
                'name' => $request->name,
                'info' => $request->info,
                'default_point' => $request->default_point,
            ]);

            $category->roles()->sync($request->roles);

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Category Updated',
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
            $category = Category::find($id);
            if ($category == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Category Not Found',
                ]);
            }
            $roles = $category->roles;
            foreach ($roles as $role) {
                $category->roles()->detach($role->id);
            }
            $category->delete();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Category Deleted',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }
}
