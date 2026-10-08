<?php
namespace App\Http\Controllers;
use App\Models\Satker;
use Illuminate\Http\Request;

class SatkerController extends Controller
{
    public function index()
    {
        return response()->json(Satker::with(['instansi', 'rup'])->get());
    }
    public function store(Request $request)
    {
        return response()->json(Satker::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(Satker::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = Satker::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        Satker::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
