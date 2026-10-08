import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface MainTableProps {
  data: any[];
  showJenisNav?: boolean;
  jenisFilter?: "tender" | "non tender";
  onJenisFilterChange?: (value: "tender" | "non tender") => void;
}

function MainTable({
  data,
  showJenisNav = true,
  jenisFilter = "tender",
  onJenisFilterChange,
}: MainTableProps) {
  const navigate = useNavigate();
  const [internalJenisTab, setInternalJenisTab] = useState<"tender" | "non tender">("tender");
  const jenisTab = jenisFilter ?? internalJenisTab;
  const setJenisTab = onJenisFilterChange ?? setInternalJenisTab;

  return (
    <>
      {showJenisNav ? (
        <div className="flex flex-col gap-y-2 px-5 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={jenisTab === "tender" ? "primary" : "outline-secondary"}
              className="w-full sm:w-auto"
              onClick={() => setJenisTab("tender")}
            >
              Tender
            </Button>
            <Button
              variant={jenisTab === "non tender" ? "primary" : "outline-secondary"}
              className="w-full sm:w-auto"
              onClick={() => setJenisTab("non tender")}
            >
              Non Tender
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-auto xl:overflow-visible mt-4">
        <Table className="border-b border-slate-200/60">
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-12 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No Kontrak
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nama Paket Pengadaan
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Penyedia / Vendor
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nilai Kontrak (Rp)
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Status Pekerjaan
              </Table.Td>
              <Table.Td className="w-36 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Aksi
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7} className="py-8 text-center text-slate-500">
                  Tidak ada paket pengadaan {jenisTab} yang siap ditagihkan.
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((item, index) => {
                const noKontrak = item.no_kontrak || `KTR-${item.id}`;
                const nama = item.paket?.nama_paket || item.nama_paket || "Paket Pengadaan";
                const vendorName = item.vendor?.nama_perusahaan || `Vendor #${item.vendor_id}`;
                const nilai = item.nilai_kontrak || item.paket?.nilai_pagu_paket || 0;
                const status = item.status_pekerjaan || "Pelaksanaan";

                return (
                  <Table.Tr key={item.id || index} className="[&_td]:last:border-b-0 hover:bg-slate-50/50">
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      {index + 1}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-medium">
                      <Link to={`/dashboard/lelang/penagihan/${item.id}`} className="text-primary hover:underline font-mono text-xs">
                        {noKontrak}
                      </Link>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <div className="font-semibold text-slate-800 dark:text-white line-clamp-2">
                        {nama}
                      </div>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-slate-700 dark:text-slate-300">
                      {vendorName}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600">
                      Rp {Number(nilai).toLocaleString("id-ID")}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'Pelaksanaan' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {status}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs px-3 py-1.5"
                        onClick={() => navigate(`/dashboard/lelang/penagihan/${item.id}`)}
                      >
                        <Lucide icon="Receipt" className="w-3.5 h-3.5 mr-1" />
                        Kelola Tagihan
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}

export default MainTable;
