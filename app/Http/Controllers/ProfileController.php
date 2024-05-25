<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        return Inertia::render('Profile/Index',
            [
                'user' => $user
            ]
        );
  }

    public function update(Request $request)
    {

        $user = auth()->user();
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
            $user = User::find($user->id);
            if ($user == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'User Not Found',
                ]);
            }
            if ($request->password) {
                $user->update(
                    [
                        'username' => $request->username,
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password),
                    ]
                );
            } else{
                $user->update(
                    [
                        'username' => $request->username,
                        'name' => $request->name,
                        'email' => $request->email,
                    ]
                );
            }
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
        return redirect()->back()->with('message' , [
            'type' => 'success',
            'text' => 'Profile Updated',
        ]);

    }
}
