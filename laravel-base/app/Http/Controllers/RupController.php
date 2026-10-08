<?php
namespace App\Http\Controllers;
use App\Models\Rup;
use Illuminate\Http\Request;

class RupController extends Controller
{
    public function index()
    {
        return response()->json(Rup::with('satker')->get());
    }
    public function store(Request $request)
    {
        return response()->json(Rup::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(Rup::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = Rup::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        Rup::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
