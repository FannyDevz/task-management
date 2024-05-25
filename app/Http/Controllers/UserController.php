<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Lib\TableApi\SimpleTableApi;

class UserController extends Controller
{
    use SimpleTableApi;
    public function index(Request $request){

        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? ''
        ];

        $query = User::query();

        if ($request->search) {
            $query = $query->where('name', 'like', '%' . $request->search . '%')
                ->where('username', 'like', '%' . $request->search . '%')
                ->where('email', 'like', '%' . $request->search . '%');
        }

        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);
        $roles = UserRole::all();

        return Inertia::render('Users/Index', [
            'results' => $results,
            'option' => $option,
            'roles' => $roles

        ]);
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $user = new User();
            $user->username = $request->username;
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->api_active = $request->api_active;
            $user->api_key = $request->api_key ?? '';
            $user->role_id = $request->role_id;
            $user->save();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'User Created',
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
            'username' => 'required',
            'name' => 'required',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $user = User::find($id);
            if ($user == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'User Not Found',
                ]);
            }
            if ($request->password){
                $user->update(
                    [
                        'username' => $request->username,
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password),
                        'api_active' => $request->api_active,
                        'api_key' => $request->api_key  ?? '',
                        'role_id' => $request->role_id,
                    ]
                );
            } else{
                $user->update(
                    [
                        'username' => $request->username,
                        'name' => $request->name,
                        'email' => $request->email,
                        'api_active' => $request->api_active,
                        'api_key' => $request->api_key ?? '',
                        'role_id' => $request->role_id,
                    ]
                );
            }
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'User Updated',
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
            $user = User::find($id);
            if ($user == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'User Not Found',
                ]);
            }
            $user->delete();
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'User Deleted',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }
}
