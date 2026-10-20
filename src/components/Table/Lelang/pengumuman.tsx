import Lucide from "@/components/Base/Lucide";
import Pagination from "@/components/Base/Pagination";
import { FormSelect, FormCheck } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import clsx from "clsx";

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
  const [internalJenisTab, setInternalJenisTab] = useState<"tender" | "non tender">("tender");
  const jenisTab = jenisFilter ?? internalJenisTab;
  const setJenisTab = onJenisFilterChange ?? setInternalJenisTab;

  // Filter dropdown state
  const [selectedNama, setSelectedNama] = useState("");
  const [selectedKode, setSelectedKode] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterKode, setFilterKode] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Selected checkbox state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Unique options for current tab
  const namaOptions = useMemo(() => {
    const list = data
      .filter((item) => {
        const jenis = (item.paket?.jenis_paket || item.jenis_paket || "tender").toLowerCase();
        return jenis === jenisTab.toLowerCase();
      })
      .map((item) => item.judul_lelang || item.nama_paket || item.paket?.nama_paket)
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [data, jenisTab]);

  const kodeOptions = useMemo(() => {
    const list = data
      .filter((item) => {
        const jenis = (item.paket?.jenis_paket || item.jenis_paket || "tender").toLowerCase();
        return jenis === jenisTab.toLowerCase();
      })
      .map((item) => item.no_lelang || item.kode_paket || item.paket?.kode_paket)
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [data, jenisTab]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const jenis = (item.paket?.jenis_paket || item.jenis_paket || "tender").toLowerCase();
      const matchJenis = jenis === jenisTab.toLowerCase();

      const nama = (item.judul_lelang || item.nama_paket || item.paket?.nama_paket || "").toLowerCase();
      const kode = (item.no_lelang || item.kode_paket || item.paket?.kode_paket || "").toLowerCase();

      const matchNama = !filterNama || nama.includes(filterNama.toLowerCase());
      const matchKode = !filterKode || kode.includes(filterKode.toLowerCase());

      return matchJenis && matchNama && matchKode;
    });
  }, [data, jenisTab, filterNama, filterKode]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, currentPage, perPage]);

  const handleCari = () => {
    setFilterNama(selectedNama);
    setFilterKode(selectedKode);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedNama("");
    setSelectedKode("");
    setFilterNama("");
    setFilterKode("");
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      {showJenisNav ? (
        <div className="flex flex-col gap-y-2 px-5 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={jenisTab === "tender" ? "primary" : "outline-secondary"}
              className="w-full sm:w-auto"
              onClick={() => {
                setJenisTab("tender");
                handleReset();
              }}
            >
              Tender
            </Button>
            <Button
              variant={jenisTab === "non tender" ? "primary" : "outline-secondary"}
              className="w-full sm:w-auto"
              onClick={() => {
                setJenisTab("non tender");
                handleReset();
              }}
            >
              Non Tender
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col justify-between px-5 py-3 border-t border-slate-200/60 sm:items-center sm:flex-row gap-x-2">
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 flex-1">
          <div className="flex-1 w-full mt-2 sm:mt-0">
            <FormSelect
              value={selectedNama}
              onChange={(e) => setSelectedNama(e.target.value)}
              className="rounded-[0.5rem]"
            >
              <option value="">Semua Nama Paket</option>
              {namaOptions.map((nama, idx) => (
                <option key={idx} value={nama}>
                  {nama}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="flex-1 w-full mt-2 sm:mt-0">
            <FormSelect
              value={selectedKode}
              onChange={(e) => setSelectedKode(e.target.value)}
              className="rounded-[0.5rem]"
            >
              <option value="">Semua Kode Paket</option>
              {kodeOptions.map((kode, idx) => (
                <option key={idx} value={kode}>
                  {kode}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>
        <div className="flex flex-row gap-x-2 mt-3 sm:mt-0">
          <Button
            variant="primary"
            className="flex flex-row items-center justify-center gap-x-2 px-4"
            onClick={handleCari}
          >
            <Lucide icon="Search" className="w-4 h-4 stroke-[1.3] text-white" />
            Cari
          </Button>
          <Button
            variant="soft-warning"
            className="flex flex-row items-center justify-center gap-x-2 px-4"
            onClick={handleReset}
          >
            <Lucide icon="X" className="w-4 h-4 stroke-[1.3] text-warning" />
            Atur Ulang
          </Button>
        </div>
      </div>

      <div className="overflow-auto xl:overflow-visible">
        <Table className="border-b border-slate-200/60">
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                <FormCheck.Input
                  type="checkbox"
                  checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Table.Td>
              <Table.Td className="w-12 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Kode Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nama Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tahap Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tgl Dibuat
              </Table.Td>
              <Table.Td className="w-36 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Aksi
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7} className="py-12 text-center text-slate-500">
                  <Lucide icon="Inbox" className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.2]" />
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                    Tidak ada data pengumuman lelang untuk kategori {jenisTab}.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba sesuaikan filter pencarian atau buat lelang baru pada menu Lelang.
                  </p>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedData.map((item, index) => {
                const kode = item.paket?.kode_paket || item.kode_paket || item.no_lelang || `PKT-${item.id}`;
                const nama = item.judul_lelang || item.paket?.nama_paket || item.nama_paket || "Paket Pengadaan";
                const tahap = item.status === "Aktif" ? "Pengumuman" : (item.status || item.paket?.tahap || "Pengumuman");
                const date = item.tanggal_mulai || item.created_at || new Date().toISOString();
                const isSelected = selectedIds.includes(item.id);

                return (
                  <Table.Tr key={item.id || index} className="[&_td]:last:border-b-0 hover:bg-slate-50/60 transition-colors">
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <FormCheck.Input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                      />
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-slate-500">
                      {(currentPage - 1) * perPage + index + 1}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <Link
                        to={`/dashboard/lelang/show/${item.id}`}
                        className="font-medium text-primary hover:underline"
                        title="Lihat detail pengumuman lelang"
                      >
                        {kode}
                      </Link>
                      {item.no_lelang && (
                        <div className="text-[11px] text-slate-400 font-normal">
                          {item.no_lelang}
                        </div>
                      )}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <div className="font-semibold text-slate-800 dark:text-white line-clamp-2">
                        {nama}
                      </div>
                      {item.paket?.satker?.nama_satker && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.paket.satker.nama_satker}
                        </div>
                      )}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <span
                        className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1", {
                          "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20":
                            tahap === "Pengumuman" || tahap === "Aktif",
                          "bg-blue-500/10 text-blue-600 border border-blue-500/20":
                            tahap === "Masa Sanggah",
                          "bg-purple-500/10 text-purple-600 border border-purple-500/20":
                            tahap === "Evaluasi",
                          "bg-slate-100 text-slate-600 border border-slate-300":
                            tahap === "Draft",
                          "bg-teal-500/10 text-teal-600 border border-teal-500/20":
                            tahap === "Selesai" || tahap === "Pelaksanaan",
                        })}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {tahap}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-slate-600 dark:text-slate-300 text-xs">
                      {new Date(date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
                        onClick={() => navigate(`/dashboard/lelang/show/${item.id}`)}
                      >
                        <Lucide icon="Eye" className="w-3.5 h-3.5" />
                        Detail
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
          <Pagination.Link
            onClick={() => setCurrentPage(1)}
            className={clsx({ "pointer-events-none opacity-50": currentPage === 1 })}
          >
            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={clsx({ "pointer-events-none opacity-50": currentPage === 1 })}
          >
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </Pagination.Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((pageNumber, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <span key={pageNumber} className="flex items-center">
                  {prev && pageNumber - prev > 1 && (
                    <Pagination.Link className="pointer-events-none">...</Pagination.Link>
                  )}
                  <Pagination.Link
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Link>
                </span>
              );
            })}

          <Pagination.Link
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={clsx({ "pointer-events-none opacity-50": currentPage === totalPages })}
          >
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link
            onClick={() => setCurrentPage(totalPages)}
            className={clsx({ "pointer-events-none opacity-50": currentPage === totalPages })}
          >
            <Lucide icon="ChevronsRight" className="w-4 h-4" />
          </Pagination.Link>
        </Pagination>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Menampilkan {filteredData.length > 0 ? (currentPage - 1) * perPage + 1 : 0} - {Math.min(currentPage * perPage, filteredData.length)} dari {filteredData.length} data</span>
          <FormSelect
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="sm:w-20 rounded-[0.5rem] ml-2"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
      </div>
    </>
  );
}

export default MainTable;
