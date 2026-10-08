<?php
namespace App\Http\Controllers;
use App\Models\VendorAkta;
use Illuminate\Http\Request;

class VendorPengurusController extends Controller
{
    public function index()
    {
        return response()->json(VendorAkta::all());
    }
    public function store(Request $request)
    {
        return response()->json(VendorAkta::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(VendorAkta::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = VendorAkta::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        VendorAkta::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
