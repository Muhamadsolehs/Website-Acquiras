<?php

namespace App\Http\Controllers;

use App\Models\PekerjaanMilestone;
use App\Models\KontrakPekerjaan;
use Illuminate\Http\Request;

class PekerjaanMilestoneController extends Controller
{
    public function index(Request $request)
    {
        $query = PekerjaanMilestone::with('kontrak')->orderBy('urutan', 'asc');

        if ($request->filled('kontrak_id')) {
            $query->where('kontrak_id', $request->kontrak_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kontrak_id' => 'required|exists:kontrak_pekerjaan,id',
            'judul_milestone' => 'required|string|max:150',
            'urutan' => 'nullable|integer',
            'target_persen' => 'required|numeric|between:0,100',
            'realisasi_persen' => 'nullable|numeric|between:0,100',
            'target_selesai' => 'nullable|date',
            'realisasi_selesai' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,completed',
            'file_dokumentasi' => 'nullable|string|max:255',
        ]);

        $item = PekerjaanMilestone::create($validated);

        // Recalculate contract progress if applicable
        $this->syncContractProgress($item->kontrak_id);

        return response()->json($item, 201);
    }

    public function show($id)
    {
        return response()->json(PekerjaanMilestone::with('kontrak')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $item = PekerjaanMilestone::findOrFail($id);
        $item->update($request->all());

        $this->syncContractProgress($item->kontrak_id);

        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = PekerjaanMilestone::findOrFail($id);
        $kontrakId = $item->kontrak_id;
        $item->delete();

        $this->syncContractProgress($kontrakId);

        return response()->json(['message' => 'Milestone berhasil dihapus']);
    }

    private function syncContractProgress($kontrakId)
    {
        $kontrak = KontrakPekerjaan::find($kontrakId);
        if ($kontrak) {
            $totalProgress = PekerjaanMilestone::where('kontrak_id', $kontrakId)->sum('realisasi_persen');
            $progress = min(100, (int)$totalProgress);
            $status = $progress >= 100 ? 'done' : ($progress > 0 ? 'progress' : 'progress');
            $kontrak->update([
                'progres_persen' => $progress,
                'status_pekerjaan' => $status,
            ]);
        }
    }
}
