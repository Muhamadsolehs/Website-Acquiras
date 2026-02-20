import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import paket from "@/fakers/paket";
import MainTableLelangVendor from "@/components/Table/Lelang/vendor";

function GuestDaftarLelang() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Daftar Lelang
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Daftar paket lelang yang tersedia.
        </p>
      </div>

      <div className="box box--stacked overflow-hidden">
        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2 border-b border-slate-200/60">
          <div className="relative">
            <Lucide
              icon="Search"
              className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
            />
            <FormInput
              type="text"
              placeholder="Cari data..."
              className="pl-9 sm:w-64 rounded-[0.5rem]"
            />
          </div>
        </div>
        <MainTableLelangVendor data={paket.fakePaket()} />
      </div>
    </div>
  );
}

export default GuestDaftarLelang;
