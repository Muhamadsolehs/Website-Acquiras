<?php
namespace App\Http\Controllers;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }
    public function store(Request $request)
    {
        return response()->json(Role::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(Role::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = Role::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        Role::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
