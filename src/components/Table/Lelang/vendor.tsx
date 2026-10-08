import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormSelect, FormCheck } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

interface MainTableProps {
  data: any[];
  showJenisNav?: boolean;
  jenisFilter?: "tender" | "non tender";
  onJenisFilterChange?: (value: "tender" | "non tender") => void;
}

function MainTable({
  data,
  showJenisNav = true,
  jenisFilter,
  onJenisFilterChange,
}: MainTableProps) {
  const navigate = useNavigate();
  const [internalJenisTab, setInternalJenisTab] = useState<
    "tender" | "non tender"
  >("tender");
  const jenisTab = jenisFilter ?? internalJenisTab;
  const setJenisTab = onJenisFilterChange ?? setInternalJenisTab;

  const filteredData = useMemo(
    () => data.filter((item) => item.jenis_paket === jenisTab),
    [data, jenisTab],
  );

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
              variant={
                jenisTab === "non tender" ? "primary" : "outline-secondary"
              }
              className="w-full sm:w-auto"
              onClick={() => setJenisTab("non tender")}
            >
              Non Tender
            </Button>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col justify-between px-5 py-3 border-t border-slate-200/60 sm:items-center sm:flex-row gap-x-2">
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <FormSelect id="department">
              <option value="" selected disabled>
                Nama Paket
              </option>
              {filteredData.map((faker, fakerKey) => (
                <option key={fakerKey} value={fakerKey}>
                  {faker.nama_paket}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <FormSelect id="department">
              <option value="" selected disabled>
                Kode Paket
              </option>
              {filteredData.map((faker, fakerKey) => (
                <option key={fakerKey} value={fakerKey}>
                  {faker.kode_paket}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
          <div>
            <Button
              variant="primary"
              className="w-32 ml-2 flex flex-row justify-center gap-x-2"
            >
              <Lucide
                icon="Search"
                className="w-4 h-4 stroke-[1.3] text-white"
              />
              Cari
            </Button>
          </div>
          <div>
            <Button
              variant="soft-warning"
              className="w-32 ml-2 flex flex-row justify-center gap-x-2"
            >
              <Lucide icon="X" className="w-4 h-4 stroke-[1.3] text-warning" />
              Atur Ulang
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-auto xl:overflow-visible">
        <Table className="border-b border-slate-200/60">
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-12 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Kode / No Lelang
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nama Paket Pengadaan
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Satker / Instansi
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nilai Pagu (Rp)
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Status / Tahap
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Jadwal
              </Table.Td>
              <Table.Td className="w-36 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Aksi
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8} className="py-8 text-center text-slate-500">
                  Tidak ada paket lelang {jenisTab} yang tersedia saat ini.
                </Table.Td>
              </Table.Tr>
            ) : (
              _.take(filteredData, 15).map((faker, fakerKey) => {
                const kode = faker.no_lelang || faker.kode_paket || faker.paket?.kode_paket || `LLG-${faker.id}`;
                const nama = faker.judul_lelang || faker.nama_paket || faker.paket?.nama_paket || "Paket Pengadaan";
                const satker = faker.paket?.satker?.nama_satker || faker.satker || "Satker Pengadaan";
                const nilai = faker.paket?.nilai_pagu_paket || faker.nilai || 0;
                const status = faker.status || faker.tahap || "Aktif";
                const tgl = faker.tanggal_mulai ? `${faker.tanggal_mulai} s/d ${faker.tanggal_selesai || '-'}` : (faker.dateCreated ? new Date(faker.dateCreated).toLocaleDateString("id-ID") : "-");

                return (
                  <Table.Tr key={faker.id || fakerKey} className="[&_td]:last:border-b-0 hover:bg-slate-50/50">
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      {fakerKey + 1}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-medium">
                      <Link to={`/dashboard/lelang/show/${faker.id}`} className="text-primary hover:underline">
                        {kode}
                      </Link>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <div className="font-semibold text-slate-800 dark:text-white line-clamp-2">
                        {nama}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Metode: {faker.paket?.metode_pengadaan || faker.metode_pengadaan || "Tender Terbuka"}
                      </div>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-slate-600 dark:text-slate-300">
                      {satker}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600 dark:text-emerald-400">
                      Rp {Number(nilai).toLocaleString("id-ID")}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        status === 'Aktif' || status === 'Pendaftaran' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' :
                        status === 'Evaluasi' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' :
                        status === 'Masa Sanggah' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                        'bg-slate-100 text-slate-800 dark:bg-darkmode-400 dark:text-slate-300'
                      }`}>
                        {status}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed text-xs text-slate-500 dark:bg-darkmode-600">
                      {tgl}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs px-3 py-1.5"
                        onClick={() => navigate(`/dashboard/lelang/show/${faker.id}`)}
                      >
                        <Lucide icon="FileSearch" className="w-3.5 h-3.5 mr-1" />
                        Ikuti Lelang
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </div>
      <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
        <Pagination className="flex-1 w-full mr-auto sm:w-auto">
          <Pagination.Link>
            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>1</Pagination.Link>
          <Pagination.Link active>2</Pagination.Link>
          <Pagination.Link>3</Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronsRight" className="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
        <FormSelect className="sm:w-20 rounded-[0.5rem]">
          <option>10</option>
          <option>25</option>
          <option>35</option>
          <option>50</option>
        </FormSelect>
      </div>
    </>
  );
}

export default MainTable;
