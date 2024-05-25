<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class HomeController extends Controller
{
    public function index()
    {
        return redirect('login');
    }

    public function home(){
        return Inertia::render('Home');
    }

    public function dashboard(){
        return Inertia::render('Home');
    }
}
