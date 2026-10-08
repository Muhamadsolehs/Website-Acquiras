<?php
namespace App\Http\Controllers;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index()
    {
        return response()->json(SystemSetting::all());
    }
    public function store(Request $request)
    {
        return response()->json(SystemSetting::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(SystemSetting::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = SystemSetting::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
}
