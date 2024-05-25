<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CustomCategoryField;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ConfigFieldsController extends Controller
{
    public function index(Request $request , $id)
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

        $query = CustomCategoryField::query();

        if ($request->search) {
            $query = $query->where('fieldname', 'like', '%' . $request->search . '%');
            $query = $query->where('fieldtype', 'like', '%' . $request->search . '%');
            $query = $query->where('detail', 'like', '%' . $request->search . '%');
        }
        $query = $query->where('category_id', $id);

        $query = $query->orderBy($option['sort'], $option['order']);
        $results = $query->paginate($option['limit']);

        return Inertia::render('Config/Fields/Index', [
            'results' => $results,
            'option' => $option,
            'category' => $category,
        ]);

    }

    public function store(Request $request , $id)
    {

        if ($id == null || $id == 0) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Data Not Found',
            ]);
        }

        $validator = Validator::make($request->all(), [
            'fieldname' => 'required',
            'fieldtype' => 'required',
            'order' => 'required',
            'hidden' => 'required',
            'required' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $category = new CustomCategoryField();
            $category->category_id = $id;
            $category->fieldname = $request->fieldname;
            $category->fieldtype = $request->fieldtype;
            $category->detail = $request->detail;
            $category->order = $request->order;
            $category->hidden = $request->hidden;
            $category->required = $request->required;
            $category->save();
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Field has been added',
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }

    }

    public function update(Request $request , $id)
    {

        if ($id == null || $id == 0) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => 'Data Not Found',
            ]);
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'fieldname' => 'required',
            'fieldtype' => 'required',
            'order' => 'required',
            'hidden' => 'required',
            'required' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {
            $category = CustomCategoryField::find($request->id);
            if ($category == null) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'Data Not Found',
                ]);
            }
            $category->update([
                'fieldname' => $request->fieldname,
                'fieldtype' => $request->fieldtype,
                'detail' => $request->detail,
                'order' => $request->order,
                'hidden' => $request->hidden,
                'required' => $request->required,
            ]);
            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Field has been updated',
            ]);
        } catch (Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }

    public function delete($id)
    {
        try {
            $category = CustomCategoryField::find($id);
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
        } catch (Exception $e) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $e->getMessage(),
            ]);
        }
    }
}
