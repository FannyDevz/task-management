<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CustomConfigCategoryForm;
use App\Models\CustomConfigCategoryOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ConfigOptionsController extends Controller
{
    public function index(Request $request, $id)
    {
        $category = Category::where('id', $id)->first();

        if ($id == null || $id == 0 || $category == null) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Data Not Found',
            ]);
        }

        $option = [
            'sort' => $request->sort ?? 'id',
            'order' => $request->order ?? 'desc',
            'limit' => $request->limit ?? 10,
            'search' => $request->search ?? ''
        ];

        $query = CustomConfigCategoryForm::with('options');

        if ($request->search) {
            $query = $query->where('formname', 'like', '%' . $request->search . '%');
            $query = $query->where('formtype', 'like', '%' . $request->search . '%');
            $query = $query->where('detail', 'like', '%' . $request->search . '%');
        }
        $query = $query->where('category_id', $id);

        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);

        return Inertia::render('Config/Options/Index', [
            'results' => $results,
            'option' => $option,
            'category' => $category,
        ]);
    }

    public function store(Request $request, $id)
    {
        if ($id == null || $id == 0) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Data Not Found',
            ]);
        }
        $validator = Validator::make($request->all(), [
            'formname' => 'required',
            'formtype' => 'required',
            'order' => 'required',
            'hidden' => 'required',
            'required' => 'required',
            'options' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }
        try {
            if (isset($request->options)) {
                $category = new CustomConfigCategoryForm();
                $category->category_id = $id;
                $category->formname = $request->formname;
                $category->formtype = $request->formtype;
                $category->detail = $request->detail;
                $category->order = $request->order;
                $category->hidden = $request->hidden;
                $category->required = $request->required;
                $category->save();

                if ($request->formtype == 'dropdown' || $request->formtype == 'radio') {
                    foreach ($request->options as $key => $value) {
                        $option = new CustomConfigCategoryOption();
                        $option->config_id = $category->id;
                        $option->optionname = $value['optionname'] ?? '';
                        $option->order = $value['order'] ?? 1;
                        $option->hidden = $value['hidden'];
                        $option->save();
                    }
                } elseif ($request->formtype == 'boolean') {
                    $options = array_slice($request->options, 0, 2);
                    foreach ($options as $key => $value) {
                        $option = new CustomConfigCategoryOption();
                        $option->config_id = $category->id;
                        $option->optionname = $value['optionname'] ?? '';
                        $option->order = $key+1;
                        $option->hidden = 0;
                        $option->save();
                    }
                }
//                elseif ($request->formtype == 'number-range') {
//                    $options = array_slice($request->options, 0, 2);
//                    foreach ($options as $key => $value) {
//                        $option = new CustomConfigCategoryOption();
//                        $option->config_id = $category->id;
//                        $option->optionname = $value['optionname'] ?? '';
//                        $option->order = $key+1;
//                        $option->hidden = 0;
//                        $option->save();
//                    }
//                }
                else{
                    CustomConfigCategoryForm::where('id', $request->$id)->delete();
                    return redirect()->back()->with('message', [
                        'type' => 'error',
                        'text' => 'Data Not Found',
                    ]);
                }
                return redirect()->back()->with('message', [
                    'type' => 'success',
                    'text' => 'Field has been added',
                ]);
            } else{
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Data Not Found',
                ]);
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        if ($id == null || $id == 0) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Data Not Found',
            ]);
        }
        $validator = Validator::make($request->all(), [
            'formname' => 'required',
            'formtype' => 'required',
            'order' => 'required',
            'hidden' => 'required',
            'required' => 'required',
            'options' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }
        try {
            $category = CustomConfigCategoryForm::findOrFail($request->id);
            $category->formname = $request->formname;
            $category->formtype = $request->formtype;
            $category->detail = $request->detail;
            $category->order = $request->order;
            $category->hidden = $request->hidden;
            $category->required = $request->required;
            $category->save();

            if ($category){
                CustomConfigCategoryOption::where('config_id', $request->id)->delete();
            }

            if (isset($request->options)) {
                if ($request->formtype == 'dropdown' || $request->formtype == 'radio') {
                    foreach ($request->options as $key => $value) {
                        $option = new CustomConfigCategoryOption();
                        $option->config_id = $category->id;
                        $option->optionname = $value['optionname'] ?? '';
                        $option->order = $value['order'] ?? 1;
                        $option->hidden = $value['hidden'];
                        $option->save();
                    }
                } elseif ($request->formtype == 'boolean') {
                    $options = array_slice($request->options, 0, 2);
                    foreach ($options as $key => $value) {
                        $option = new CustomConfigCategoryOption();
                        $option->config_id = $category->id;
                        $option->optionname = $value['optionname'] ?? '';
                        $option->order = $key+1;
                        $option->hidden = 0;
                        $option->save();
                    }
                } elseif ($request->formtype == 'number-range') {
                    $options = array_slice($request->options, 0, 2);
                    foreach ($options as $key => $value) {
                        $option = new CustomConfigCategoryOption();
                        $option->config_id = $category->id;
                        $option->optionname = $value['optionname'] ?? '';
                        $option->order = $key+1;
                        $option->hidden = 0;
                        $option->save();
                    }
                } else{
                    return redirect()->back()->with('message', [
                        'type' => 'error',
                        'text' => 'Data Not Found',
                    ]);
                }
            }

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Field has been updated',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }

    public function delete($id)
    {
        try {
            $category = CustomConfigCategoryForm::find($id);
            if ($category == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Data Not Found',
                ]);
            }
            $category->delete();
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Field has been deleted',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }
}
