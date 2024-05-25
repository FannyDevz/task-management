<?php

use App\Http\Middleware\CheckPermission;
use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\HomeController::class, 'index']);
Route::get('/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');;
Route::post('/login', [App\Http\Controllers\AuthController::class, 'authenticate'])->name('login.store');;
Route::get('/register', [App\Http\Controllers\AuthController::class, 'register'])->name('register');
Route::post('/register', [App\Http\Controllers\AuthController::class, 'store'])->name('register.store');


Route::middleware(['auth', 'auth.session'])->group(function () {

    //DASHBOARD AND OTHER PAGE WITHOUT PERMISSION
    Route::get('/dashboard', [App\Http\Controllers\HomeController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    //USER
    Route::middleware(['CheckPermission:users.index'])
        ->get('/users', [App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::middleware(['CheckPermission:users.store'])
        ->post('/users', [App\Http\Controllers\UserController::class, 'store'])->name('users.store');
    Route::middleware(['CheckPermission:users.update'])
        ->post('/users/edit/{id}', [App\Http\Controllers\UserController::class, 'update'])->name('users.update');
    Route::middleware(['CheckPermission:users.delete'])
        ->delete('/users/{id}', [App\Http\Controllers\UserController::class, 'delete'])->name('users.delete');

    //ROLE
    Route::middleware(['CheckPermission:roles.index'])
        ->get('/roles', [App\Http\Controllers\RoleController::class, 'index'])->name('roles.index');
    Route::middleware(['CheckPermission:roles.store'])
        ->post('/roles', [App\Http\Controllers\RoleController::class, 'store'])->name('roles.store');
    Route::middleware(['CheckPermission:roles.update'])
        ->post('/roles/edit/{id}', [App\Http\Controllers\RoleController::class, 'update'])->name('roles.update');
    Route::middleware(['CheckPermission:roles.delete'])
        ->delete('/roles/{id}', [App\Http\Controllers\RoleController::class, 'delete'])->name('roles.delete');

    //PERMISSION
    Route::middleware(['CheckPermission:permissions.index'])
        ->get('/permissions', [App\Http\Controllers\PermissionController::class, 'index'])->name('permissions.index');
    Route::middleware(['CheckPermission:permissions.update'])
        ->post('/permissions/{role}', [App\Http\Controllers\PermissionController::class, 'update'])->name('permissions.update');

    //SETTINGs
    Route::middleware(['CheckPermission:settings.index'])
        ->get('/settings', [App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
    Route::middleware(['CheckPermission:settings.update'])
        ->post('/settings', [App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');

    //TASK
    Route::middleware(['CheckPermission:tasks.index'])
        ->get('/list-tasks', [App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');
    Route::middleware(['CheckPermission:tasks.add'])
        ->get('/tasks', [App\Http\Controllers\TaskController::class, 'create'])->name('tasks.add');
    Route::middleware(['CheckPermission:tasks.store'])
        ->post('/tasks', [App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
    Route::middleware(['CheckPermission:tasks.update'])
        ->get('/tasks/edit/{id}', [App\Http\Controllers\TaskController::class, 'edit'])->name('tasks.edit');
    Route::middleware(['CheckPermission:tasks.update'])
        ->post('/tasks/edit/{id}', [App\Http\Controllers\TaskController::class, 'update'])->name('tasks.update');
    Route::middleware(['CheckPermission:tasks.delete'])
        ->delete('/tasks/delete/{id}', [App\Http\Controllers\TaskController::class, 'delete'])->name('tasks.delete');

    Route::middleware(['CheckPermission:tasks.all.index'])
        ->get('/list-all-tasks', [App\Http\Controllers\TaskController::class, 'all_index'])->name('tasks.all.index');
    Route::middleware(['CheckPermission:tasks.change.status'])
        ->post('/tasks/change-status', [App\Http\Controllers\TaskController::class, 'changeStatus'])->name('tasks.change.status');
    Route::middleware(['CheckPermission:tasks.all.update'])
        ->get('/all-tasks/edit/{id}', [App\Http\Controllers\TaskController::class, 'edit'])->name('tasks.all.edit');
    Route::middleware(['CheckPermission:tasks.all.update'])
        ->post('/all-tasks/edit/{id}', [App\Http\Controllers\TaskController::class, 'update'])->name('tasks.all.update');
    Route::middleware(['CheckPermission:tasks.all.delete'])
        ->delete('/all-tasks/delete/{id}', [App\Http\Controllers\TaskController::class, 'delete'])->name('tasks.all.delete');
    Route::middleware(['CheckPermission:tasks.bulk.delete'])
        ->post('/all-tasks/bulk-delete', [App\Http\Controllers\TaskController::class, 'bulkDelete'])->name('tasks.bulk.delete');


    //CATEGORY
    Route::middleware(['CheckPermission:categories.index'])
        ->get('/categories', [App\Http\Controllers\CategoriesController::class, 'index'])->name('categories.index');
    Route::middleware(['CheckPermission:categories.store'])
        ->post('/categories', [App\Http\Controllers\CategoriesController::class, 'store'])->name('categories.store');
    Route::middleware(['CheckPermission:categories.update'])
        ->post('/categories/edit/{id}', [App\Http\Controllers\CategoriesController::class, 'update'])->name('categories.update');
    Route::middleware(['CheckPermission:categories.delete'])
        ->delete('/categories/delete/{id}', [App\Http\Controllers\CategoriesController::class, 'delete'])->name('categories.delete');

    //CONFIG-FIELD
    Route::middleware(['CheckPermission:config.field.index'])
        ->get('/categories/{id}/config-fields/', [App\Http\Controllers\ConfigFieldsController::class, 'index'])->name('config.field.index');
    Route::middleware(['CheckPermission:config.field.store'])
        ->post('/config-fields/{id}', [App\Http\Controllers\ConfigFieldsController::class, 'store'])->name('config.field.store');
    Route::middleware(['CheckPermission:config.field.update'])
        ->post('/config-fields/{id}/update', [App\Http\Controllers\ConfigFieldsController::class, 'update'])->name('config.field.update');
    Route::middleware(['CheckPermission:config.field.delete'])
        ->delete('/config-fields/{id}/delete', [App\Http\Controllers\ConfigFieldsController::class, 'delete'])->name('config.field.delete');

    //CONFIG-FIELD
    Route::middleware(['CheckPermission:config.option.index'])
        ->get('/categories/{id}/config-options/', [App\Http\Controllers\ConfigOptionsController::class, 'index'])->name('config.option.index');
    Route::middleware(['CheckPermission:config.option.store'])
        ->post('/config-options/{id}', [App\Http\Controllers\ConfigOptionsController::class, 'store'])->name('config.option.store');
    Route::middleware(['CheckPermission:config.option.update'])
        ->post('/config-options/{id}/update', [App\Http\Controllers\ConfigOptionsController::class, 'update'])->name('config.option.update');
    Route::middleware(['CheckPermission:config.option.delete'])
        ->delete('/config-options/{id}/delete', [App\Http\Controllers\ConfigOptionsController::class, 'delete'])->name('config.option.delete');

    //LOGOUT
    Route::any('/logout', [App\Http\Controllers\AuthController::class, 'logout'])->name('logout');
});

