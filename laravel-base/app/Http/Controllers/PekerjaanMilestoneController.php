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
        // Support frontend aliases
        $data = $request->all();
        if (isset($data['bobot_persen']) && !isset($data['target_persen'])) {
            $request->merge(['target_persen' => $data['bobot_persen']]);
        }
        if (isset($data['tanggal_target']) && !isset($data['target_selesai'])) {
            $request->merge(['target_selesai' => $data['tanggal_target']]);
        }
        if (isset($data['status_milestone']) && !isset($data['status'])) {
            $request->merge(['status' => 'pending']);
        }
        if (isset($data['progress_persen']) && !isset($data['realisasi_persen'])) {
            $request->merge(['realisasi_persen' => $data['progress_persen']]);
        }

        $validated = $request->validate([
            'kontrak_id' => 'required|exists:kontrak_pekerjaan,id',
            'judul_milestone' => 'required|string|max:150',
            'urutan' => 'nullable|integer',
            'target_persen' => 'required|numeric|between:0,100',
            'realisasi_persen' => 'nullable|numeric|between:0,100',
            'target_selesai' => 'nullable|date',
            'realisasi_selesai' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,completed,Belum Mulai,Dalam Progres,Selesai',
            'file_dokumentasi' => 'nullable|string|max:255',
        ]);

        // Normalize status
        if (isset($validated['status'])) {
            if ($validated['status'] === 'Belum Mulai') $validated['status'] = 'pending';
            elseif ($validated['status'] === 'Dalam Progres') $validated['status'] = 'in_progress';
            elseif ($validated['status'] === 'Selesai') $validated['status'] = 'completed';
        }

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
        $data = $request->all();

        // Support frontend aliases
        if (isset($data['progress_persen']) && !isset($data['realisasi_persen'])) {
            $data['realisasi_persen'] = $data['progress_persen'];
        }
        if (isset($data['bobot_persen']) && !isset($data['target_persen'])) {
            $data['target_persen'] = $data['bobot_persen'];
        }
        if (isset($data['tanggal_target']) && !isset($data['target_selesai'])) {
            $data['target_selesai'] = $data['tanggal_target'];
        }
        if (isset($data['status_milestone'])) {
            if ($data['status_milestone'] === 'Selesai') $data['status'] = 'completed';
            elseif ($data['status_milestone'] === 'Dalam Progres') $data['status'] = 'in_progress';
            else $data['status'] = 'pending';
        }

        $item->update($data);

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
            $status = $progress >= 100 ? 'Selesai' : ($progress > 0 || !empty($kontrak->no_surat_jalan) ? 'Pelaksanaan' : 'Persiapan');
            $kontrak->update([
                'progres_persen' => $progress,
                'status_pekerjaan' => $status,
            ]);
        }
    }
}
