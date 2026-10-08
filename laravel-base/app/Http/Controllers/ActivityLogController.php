<?php
namespace App\Http\Controllers;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        return response()->json(ActivityLog::with('user')->latest('created_at')->get());
    }
    public function store(Request $request)
    {
        return response()->json(ActivityLog::create($request->all()), 201);
    }
    public function show($id)
    {
        return response()->json(ActivityLog::findOrFail($id));
    }
    public function destroy($id)
    {
        ActivityLog::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
