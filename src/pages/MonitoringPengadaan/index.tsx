import Lucide from "@/components/Base/Lucide";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import ReportDonutChart from "@/components/ReportDonutChart";
import Progress from "@/components/Base/Progress";
import { useState } from "react";

function Main() {
  const [viewType, setViewType] = useState<"nilai" | "paket" | "data">("nilai");

  const belanja = "Rp 1.090.079.207.707.461";
  const totalRup = "Rp 1.190.248.195.841.119";
  const persenPengisian = "109.19%";

  return (
    <div className="grid grid-cols-12 gap-y-6 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-base font-medium group-[.mode--light]:text-white">Profil Pengadaan Monitoring</div>
            <div className="text-base font-medium group-[.mode--light]:text-white">Live Monitoring Dashboard</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-2">
            <FormSelect>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </FormSelect>
          </div>
          <div className="col-span-2">
            <FormSelect>
              <option>Pilih Jenis Instansi</option>
            </FormSelect>
          </div>
          <div className="col-span-2">
            <FormSelect>
              <option>(Pilih Jenis Instansi dahulu)</option>
            </FormSelect>
          </div>
          <div className="col-span-2">
            <FormSelect>
              <option>(Pilih Instansi dahulu)</option>
            </FormSelect>
          </div>
          <div className="col-span-2">
            <FormSelect>
              <option>(Pilih Instansi dahulu)</option>
            </FormSelect>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            className={`px-3 py-1 rounded-full ${viewType === "nilai" ? "bg-primary text-white" : "group-[.mode--light]:text-slate-800 bg-slate-200"}`}
            onClick={() => setViewType("nilai")}
          >
            Nilai
          </Button>
          <Button
            className={`px-3 py-1 rounded-full ${viewType === "paket" ? "bg-primary text-white" : "group-[.mode--light]:text-slate-800 bg-slate-200"}`}
            onClick={() => setViewType("paket")}
          >
            Paket
          </Button>
          <Button
            className={`px-3 py-1 rounded-full ${viewType === "data" ? "bg-primary text-white" : "group-[.mode--light]:text-slate-800 bg-slate-200"}`}
            onClick={() => setViewType("data")}
          >
            Data
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-6">
          <div className="col-span-4 box box--stacked p-5">
            <div className="text-sm text-slate-500">Belanja Pengadaan</div>
            <div className="mt-6 text-2xl font-bold">{belanja}</div>
          </div>

          <div className="col-span-4 box box--stacked p-5">
            <div className="text-sm text-slate-500">Total RUP</div>
            <div className="mt-6 text-2xl font-bold">{totalRup}</div>
          </div>

          <div className="col-span-4 box box--stacked p-5 flex flex-col items-center justify-center">
            <div className="text-sm text-slate-500 mb-4">% Pengisian RUP</div>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-lg font-semibold">{persenPengisian}</div>
              </div>
              <ReportDonutChart width={160} height={160} />
            </div>
            <div className="text-xs text-slate-400 mt-3">Total RUP 100%</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-4 box p-5">
            <div className="text-sm mb-4">Penyedia/Swakelola</div>
            <div className="w-full p-3 rounded bg-white/50">
              <div className="mb-2 text-sm text-slate-500">Penyedia</div>
              <div className="w-full h-6 bg-slate-200 rounded overflow-hidden">
                <Progress.Bar style={{ width: "77%" }}>77%</Progress.Bar>
              </div>
              <div className="mt-3 text-xs text-slate-500">Penyedia: Rp 915.127.531.496.713 | Swakelola: Rp 275.120.664.344.406</div>
            </div>
          </div>

          <div className="col-span-4 box p-5">
            <div className="text-sm mb-4">PDN/Impor</div>
            <div className="w-full p-3 rounded bg-white/50">
              <div className="mb-2 text-sm text-slate-500">PDN</div>
              <div className="w-full h-6 bg-slate-200 rounded overflow-hidden">
                <Progress.Bar style={{ width: "91%" }}>91%</Progress.Bar>
              </div>
              <div className="mt-3 text-xs text-slate-500">PDN: Rp 836.941.236.294.098 | Impor: Rp 78.186.295.202.615</div>
            </div>
          </div>

          <div className="col-span-4 box p-5">
            <div className="text-sm mb-4">UMKK/Non UMKK</div>
            <div className="w-full p-3 rounded bg-white/50">
              <div className="mb-2 text-sm text-slate-500">UMKK</div>
              <div className="w-full h-6 bg-slate-200 rounded overflow-hidden">
                <Progress.Bar style={{ width: "54%" }}>54%</Progress.Bar>
              </div>
              <div className="mt-3 text-xs text-slate-500">UMKK: Rp 495.412.683.586.110 | Non UMKK: Rp 418.807.729.054.302</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;