<?php
namespace App\Http\Controllers;
use App\Models\PaketPengadaan;
use Illuminate\Http\Request;

class PaketPengadaanController extends Controller
{
    public function index()
    {
        return response()->json(PaketPengadaan::with(['rup', 'satker'])->get());
    }
    public function store(Request $request)
    {
        return response()->json(PaketPengadaan::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(PaketPengadaan::with(['lelang', 'kontrak'])->findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $data = PaketPengadaan::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }
    public function destroy($id)
    {
        PaketPengadaan::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
