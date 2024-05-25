<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CustomCategoryFieldValue;
use App\Models\CustomCategoryOptionValue;
use App\Models\CustomConfigCategoryForm;
use App\Models\PermissionList;
use App\Models\RoleCategory;
use App\Models\Task;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $role = $user->role;
        $category = RoleCategory::where('role_id', $role->id)->pluck('category_id');

        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? '',
            'filter' => $request->filter ?? []
        ];

        $query = Task::with([
            'category' => function ($query) use ($category) {
                $query->whereIn('id' , $category );
            },
            'option_values',
            'option_values.form',
            'option_values.option',
            'field_values',
            'field_values.field',
            'user'
        ])->where('user_id', '=', $user->id);

        $filter = $option['filter'];
        if ($filter) {
            if (isset($filter['subject']) && $filter['subject'] !== ''){
                $query->where('subject', 'like', '%' . $filter['subject'] . '%');
            }
            if (isset($filter['description']) && $filter['description'] !== '') {
                $query->where('description', 'like', '%' . $filter['description'] . '%');
            }
            if (isset($filter['status']) && $filter['status'] !== '') {
                $query->where('status', '=', $filter['status']);
            }
//            if (isset($filter['point']) && $filter['point'] !== '') {
//                $query->where('point', '=', $filter['point']);
//            }
//            if (isset($filter['extrapoint']) && $filter['extrapoint'] !== '') {
//                $query->where('extra_point', '=', $filter['extrapoint']);
//            }
            if (isset($filter['category']) && $filter['category'] !== '') {
                $query->whereHas('category', function ($q) use ($filter) {
                    $q->where('name', 'like', '%' . $filter['category'] . '%');
                });
            }
//            if (isset($filter['username']) && $filter['username'] !== '') {
//                $query->whereHas('user', function ($q) use ($filter) {
//                    $q->where('name', 'like', '%' . $filter['username'] . '%');
//                });
//            }
        }


        $sort = $option['sort'];
        $order = $option['order'];

         if ($sort === 'category') {
            $query->orderBy(Category::select('name')->whereColumn('categories.id', 'tasks.category_id'), $order);
        }
         else {
            $query->orderBy($sort, $order);
        }
        $results = $query->paginate($option['limit']);
        return Inertia::render('Tasks/Index', [
            'results' => $results,
            'option' => $option,
        ]);
    }

    public function all_index(Request $request)
    {
        $user = auth()->user();
        $role = $user->role;
        $category = RoleCategory::where('role_id', $role->id)->pluck('category_id');

        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? '',
            'filter' => $request->filter ?? []
        ];

        $query = Task::with([
            'category' => function ($query) use ($category) {
                $query->whereIn('id' , $category );
            },
            'option_values',
            'option_values.form',
            'option_values.option',
            'field_values',
            'field_values.field',
            'user'
        ]);

//        if ($request->search) {
//            $query->where(function ($q) use ($request) {
//                $q->where('subject', 'like', '%' . $request->search . '%')
//                    ->orWhere('description', 'like', '%' . $request->search . '%');
//            });
//        }
        $filter = $option['filter'];
        if ($filter) {
            if (isset($filter['subject']) && $filter['subject'] !== ''){
                $query->where('subject', 'like', '%' . $filter['subject'] . '%');

            }
            if (isset($filter['description']) && $filter['description'] !== '') {
                $query->where('description', 'like', '%' . $filter['description'] . '%');
            }
            if (isset($filter['status']) && $filter['status'] !== '') {
                $query->where('status', '=', $filter['status']);
            }
            if (isset($filter['point']) && $filter['point'] !== '') {
                $query->where('point', '=', $filter['point']);
            }
            if (isset($filter['extrapoint']) && $filter['extrapoint'] !== '') {
                $query->where('extra_point', '=', $filter['extrapoint']);
            }
            if (isset($filter['category']) && $filter['category'] !== '') {
                $query->whereHas('category', function ($q) use ($filter) {
                    $q->where('name', 'like', '%' . $filter['category'] . '%');
                });
            }
            if (isset($filter['username']) && $filter['username'] !== '') {
                $query->whereHas('user', function ($q) use ($filter) {
                    $q->where('name', 'like', '%' . $filter['username'] . '%');
                });
            }
        }

        $sort = $option['sort'];
        $order = $option['order'];

        if ($sort === 'category') {
            $query->orderBy(Category::select('name')->whereColumn('categories.id', 'tasks.category_id'), $order);
        }
        elseif ($sort === 'name') {
            $query->orderBy(User::select('name')->whereColumn('users.id', 'tasks.user_id'), $order);
        }
        else {
            $query->orderBy($sort, $order);
        }


        $results = $query->paginate($option['limit']);

        return Inertia::render('Tasks/AllIndex', [
            'results' => $results,
            'option' => $option,
        ]);
    }

    public function create()
    {
        $role = auth()->user()->role;
        $category = RoleCategory::where('role_id', $role->id)->pluck('category_id');
        $customforms = Category::with([
            'forms' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            },
            'forms.options' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            },
            'fields' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            }
        ])->whereIn('id' , $category )->get();

        return Inertia::render('Tasks/Create', [
            'customforms' => $customforms,
        ]);
    }

    public function edit($id)
    {

        $role = auth()->user()->role;
        $category = RoleCategory::where('role_id', $role->id)->pluck('category_id');
        $customforms = Category::with([
            'forms' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            },
            'forms.options' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            },
            'fields' => function ($query) {
                $query->orderBy('order')->where('hidden', 0);
            }
        ])->whereIn('id' , $category )->get();

        $results = Task::with([
            'category' => function ($query) use ($category) {
                $query->whereIn('id' , $category );
            },
            'option_values',
            'field_values',
            'user'
        ])->findOrFail($id);

        return Inertia::render('Tasks/Edit', [
            'customforms' => $customforms,
            'results' => $results
        ]);
    }

    public function store(Request $request)
    {

        $year = date('Y');
        $month = date('m');
        $validator = Validator::make($request->all(), [
            'category_id' => 'required',
            'subject' => 'required',
            'attachment' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }
        try {
            if ($request->hasFile('attachment')) {
                $filesystemDriver = config('filesystems.default');
                if ($filesystemDriver === 'local') {
                    $filePath = $request->file('attachment')->store('uploads/'.$year.'/'.$month, 'public');
                    $fileUrl = Storage::disk('public')->url($filePath);
                } elseif ($filesystemDriver === 's3') {
                    $filePath = $request->file('attachment')->store('uploads/'.$year.'/'.$month, 's3');
                    $fileUrl = Storage::disk('s3')->url($filePath);
                } else {
                    return response()->json(['error' => 'Filesystem driver not supported'], 400);
                }
            }

            $category = Category::find($request->category_id);

            $task = Task::create([
                'user_id' => auth()->user()->id,
                'category_id' => $request->category_id,
                'subject' => $request->subject,
                'description' => $request->description ?? null,
                'attachment' => $fileUrl ?? null,
                'point' => $category->default_point ?? 0,
                'extra_point' =>  0,
                'status' => 'new',
            ]);

            if ($request->fields) {
                $fields = $request->fields;
                foreach ($fields as $key => $value) {
                    $customfields = CustomCategoryFieldValue::create([
                        'task_id' => $task->id,
                        'config_id' => $value['configid'],
                        'value' => $value['value'],
                    ]);
                }
            }
            if ($request->forms) {
                $forms = $request->forms;
                foreach ($forms as $key => $value) {
                    $customforms = CustomConfigCategoryForm::with(['options' => function ($query) {
                        $query->orderBy('order')->where('hidden', 0);
                    }])->find($value['configid']);

                    if ($customforms->formtype == 'dropdown') {

                        if (empty($value['value'])) {
                            $value['value'] = $customforms->options[0]->id;
                        }
                    }  elseif ($customforms->formtype == 'radio') {
                        if ($value['value'] == null || empty($value['value'])) {
                            $value['value'] = $customforms->options[0]->id;
                        }
                    } elseif ($customforms->formtype == 'boolean') {
                        if (empty($value['value'])) {
                            $value['value']  = $customforms->options[0]->id;
                        }
                    }
//                    else if ($customforms->formtype == 'number-range') {
//
//                        if (empty($value['value']) || !is_array($value['value'])) {
//                            $value['value']  = $customforms->options[0]->id;
//                            dd("A",$value);
//                        } else{
//                            $value['value']  = $value['value'][0];
//                            dd("B",$value);
//                        }
//
//                    }
                    $customformsvalue = CustomCategoryOptionValue::create([
                        'task_id' => $task->id,
                        'config_id' => $value['configid'],
                        'option_id' => $value['value'],
                    ]);
                }
            }
            return redirect()->route('tasks.index')->with('message', [
                'type' => 'success',
                'text' => 'Task created successfully',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
    }

    public function update(Request $request ,$id)
    {
        $year = date('Y');
        $month = date('m');
        $validator = Validator::make($request->all(), [
            'category_id' => 'required',
            'subject' => 'required',
            'attachment' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }
        try {
            if ($request->hasFile('attachment')) {
                $filesystemDriver = config('filesystems.default');
                if ($filesystemDriver === 'local') {
                    $filePath = $request->file('attachment')->store('uploads/'.$year.'/'.$month, 'public');
                    $fileUrl = Storage::disk('public')->url($filePath);
                } elseif ($filesystemDriver === 's3') {
                    $filePath = $request->file('attachment')->store('uploads/'.$year.'/'.$month, 's3');
                    $fileUrl = Storage::disk('s3')->url($filePath);
                } else {
                    return response()->json(['error' => 'Filesystem driver not supported'], 400);
                }
            }

            $category = Category::find($request->category_id);

            $task = Task::find($id);
            $task->update([
                'category_id' => $request->category_id,
                'subject' => $request->subject,
                'description' => $request->description ?? null,
                'point' => $category->default_point ?? 0,
                'extra_point' =>  0,
                'status' => 'edited',
            ]);

            if ($request->hasFile('attachment')) {
                $task->update([
                    'attachment' => $fileUrl ?? null,
                ]);
            }

            if ($request->fields) {
                $fields = $request->fields;
                foreach ($fields as $key => $value) {
                    $customfields = CustomCategoryFieldValue::where('task_id', $task->id)->where('config_id', $value['configid'])->first();
                    if ($customfields) {
                        $customfields->update([
                            'value' => $value['value'],
                        ]);
                    } else {
                        $customfields = CustomCategoryFieldValue::create([
                            'task_id' => $task->id,
                            'config_id' => $value['configid'],
                            'value' => $value['value'],
                        ]);
                    }
                }
            }
            if ($request->forms) {
                $forms = $request->forms;
                foreach ($forms as $key => $value) {
                    $customforms = CustomConfigCategoryForm::with(['options' => function ($query) {
                        $query->orderBy('order')->where('hidden', 0);
                    }])->find($value['configid']);

                    if ($customforms->formtype == 'dropdown') {
                        if (empty($value['value'])) {
                            $value['value'] = $customforms->options[0]->id;
                        }
                    }  elseif ($customforms->formtype == 'radio') {
                        if ($value['value'] == null || empty($value['value'])) {
                            $value['value'] = $customforms->options[0]->id;
                        }
                    } elseif ($customforms->formtype == 'boolean') {
                        if (empty($value['value'])) {
                            $value['value']  = $customforms->options[0]->id;
                        }
                    } else if ($customforms->formtype == 'number-range') {
                        if (empty($value['value']) || !is_array($value['value'])) {
                            $value['value']  = $customforms->options[0]->id;

                        } else{
                            $value['value']  = $value['value'][0];
                        }
                    }

                    $customformsvalue = CustomCategoryOptionValue::where('task_id', $task->id)->where('config_id', $value['configid'])->first();
                    if ($customformsvalue) {
                        $customformsvalue->update([
                            'option_id' => $value['value'],
                        ]);
                    } else {
                        $customformsvalue = CustomCategoryOptionValue::create([
                            'task_id' => $task->id,
                            'config_id' => $value['configid'],
                            'option_id' => $value['value'],
                        ]);
                    }
                }
            }
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Task updated successfully',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
    }


    public function delete($id)
    {
        try{
            Task::find($id)->delete();
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Task deleted successfully',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
    }
    public function changeStatus(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'ids' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        $total = 0;
        try {
            if (empty($request->status) && empty($request->extra_point)) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Please select status or enter extra point',
                ]);
            }

            if (empty($request->status)) {
                Task::whereIn('id', $request->ids)->update([
                    'extra_point' => $request->extra_point,
                ]);
                $total++;
            }else if (empty($request->extra_point)) {
                Task::whereIn('id', $request->ids)->update([
                    'status' => $request->status,
                ]);
                $total++;
            } else {
                Task::whereIn('id', $request->ids)->update([
                    'status' => $request->status,
                    'extra_point' => $request->extra_point,
                ]);
                $total++;
            }

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Task updated '.$total.' successfully',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }

    }


    public function bulkDelete(Request $request )
    {

        $validator = Validator::make($request->all(), [
            'ids' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }
        $total = 0;
        try{
            foreach ($request->ids as $id) {
                Task::find($id)->delete();
                $total++;
            }
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Task deleted '.$total.' successfully',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
    }

}
