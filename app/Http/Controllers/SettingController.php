<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Hamcrest\Core\Set;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index(){
        $setting = Setting::all();

        return Inertia::render('Settings/Index', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request){

        $validator = Validator::make($request->all(), [
            'instancename' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $validator->errors()->first(),
            ]);
        }

        try {

            $this->saveChanges('instancename', $request->instancename);
            if ($request->hasFile('instancelogo')) {
//                $filesystemDriver = config('filesystems.default');
//                if ($filesystemDriver === 'local') {
                    $filePath = $request->file('instancelogo')->store('uploads/logo', 'public');
                    $fileUrl = Storage::disk('public')->url($filePath);
//                } elseif ($filesystemDriver === 's3') {
//                    $filePath = $request->file('instancelogo')->store('uploads/logo', 's3');
//                    $fileUrl = Storage::disk('s3')->url($filePath);
//                } else {
//                    return response()->json(['error' => 'Filesystem driver not supported'], 400);
//                }
                $this->saveChanges('instancelogo', $fileUrl);
            }

            if (isset($request->domainname) && $request->domainname != null) {
                $this->saveChanges('domainname', $request->domainname);
            }
            if (isset($request->email) && $request->email != null) {
                $this->saveChanges('email', $request->email);
            }
            if (isset($request->phonenumber) && $request->phonenumber != null) {
                $this->saveChanges('phonenumber', $request->phonenumber);
            }
            if (isset($request->address) && $request->address != null) {
                $this->saveChanges('address', $request->address);
            }
            $this->saveChanges('announcement', $request->announcement ?? '');

            return redirect()->back()->with('message', [
                'type' => 'success',
                'text' => 'Data has been updated',
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('message', [
                'type' => 'error',
                'text' => $th->getMessage(),
            ]);
        }
    }
    public function saveChanges($key, $value)
    {
        $setting = Setting::where('key', $key)->first();
        $setting->value = $value;
        $setting->save();
    }
}
