<?php
namespace App\Http\Controllers;
use App\Models\Instansi;
use Illuminate\Http\Request;

class InstansiController extends Controller
{
    public function index()
    {
        return response()->json(Instansi::with('satker')->get());
    }
    public function store(Request $request)
    {
        return response()->json(Instansi::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(Instansi::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = Instansi::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        Instansi::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
