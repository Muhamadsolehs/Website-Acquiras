import Lucide from "@/components/Base/Lucide";
import { FormSelect } from "@/components/Base/Form";
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

  // State untuk filter dropdown
  const [selectedNama, setSelectedNama] = useState("");
  const [selectedKode, setSelectedKode] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterKode, setFilterKode] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Baca jenis_paket dari relasi paket atau langsung dari item
      const jenis = (
        item.paket?.jenis_paket ||
        item.jenis_paket ||
        "tender"
      ).toLowerCase();
      const matchJenis = jenis === jenisTab.toLowerCase();

      const nama = (
        item.judul_lelang ||
        item.nama_paket ||
        item.paket?.nama_paket ||
        ""
      ).toLowerCase();
      const kode = (
        item.no_lelang ||
        item.kode_paket ||
        item.paket?.kode_paket ||
        ""
      ).toLowerCase();

      const matchNama =
        !filterNama || nama.includes(filterNama.toLowerCase());
      const matchKode =
        !filterKode || kode.includes(filterKode.toLowerCase());

      return matchJenis && matchNama && matchKode;
    });
  }, [data, jenisTab, filterNama, filterKode]);

  // List opsi dropdown unik sesuai jenis yang aktif
  const namaOptions = useMemo(() => {
    const list = data
      .filter(
        (item) =>
          (
            item.paket?.jenis_paket ||
            item.jenis_paket ||
            "tender"
          ).toLowerCase() === jenisTab.toLowerCase()
      )
      .map(
        (item) =>
          item.judul_lelang || item.nama_paket || item.paket?.nama_paket
      )
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [data, jenisTab]);

  const kodeOptions = useMemo(() => {
    const list = data
      .filter(
        (item) =>
          (
            item.paket?.jenis_paket ||
            item.jenis_paket ||
            "tender"
          ).toLowerCase() === jenisTab.toLowerCase()
      )
      .map(
        (item) =>
          item.no_lelang || item.kode_paket || item.paket?.kode_paket
      )
      .filter(Boolean);
    return Array.from(new Set(list));
  }, [data, jenisTab]);

  const handleCari = () => {
    setFilterNama(selectedNama);
    setFilterKode(selectedKode);
  };

  const handleReset = () => {
    setSelectedNama("");
    setSelectedKode("");
    setFilterNama("");
    setFilterKode("");
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
              variant={
                jenisTab === "non tender" ? "primary" : "outline-secondary"
              }
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
            <Lucide
              icon="Search"
              className="w-4 h-4 stroke-[1.3] text-white"
            />
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
              <Table.Td className="w-12 py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                No
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Kode / No Lelang
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Nama Paket Pengadaan
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Satker / Instansi
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Nilai Pagu (Rp)
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Status / Tahap
              </Table.Td>
              <Table.Td className="py-4 font-semibold border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Jadwal
              </Table.Td>
              <Table.Td className="w-36 py-4 font-semibold text-center border-t bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-darkmode-400">
                Aksi
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={8}
                  className="py-12 text-center text-slate-500"
                >
                  <Lucide
                    icon="Inbox"
                    className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.2]"
                  />
                  Tidak ada paket lelang {jenisTab} yang tersedia saat ini.
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredData.map((faker, fakerKey) => {
                const kode =
                  faker.no_lelang ||
                  faker.kode_paket ||
                  faker.paket?.kode_paket ||
                  `LLG-${faker.id}`;
                const nama =
                  faker.judul_lelang ||
                  faker.nama_paket ||
                  faker.paket?.nama_paket ||
                  "Paket Pengadaan";
                const satker =
                  faker.paket?.satker?.nama_satker ||
                  faker.satker ||
                  "Biro PBJ";
                const nilai =
                  faker.paket?.nilai_pagu ||
                  faker.paket?.nilai_pagu_paket ||
                  faker.nilai ||
                  0;
                const status = faker.status || faker.tahap || "Aktif";
                const tgl = faker.tanggal_mulai
                  ? `${faker.tanggal_mulai} s/d ${faker.tanggal_selesai || "-"}`
                  : "-";

                return (
                  <Table.Tr
                    key={faker.id || fakerKey}
                    className="[&_td]:last:border-b-0 hover:bg-slate-50/50"
                  >
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      {fakerKey + 1}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-medium">
                      <Link
                        to={`/dashboard/lelang/show/${faker.id}`}
                        className="text-primary hover:underline font-mono text-xs font-semibold"
                      >
                        {kode}
                      </Link>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <div className="font-semibold text-slate-800 dark:text-white line-clamp-2">
                        {nama}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Metode:{" "}
                        {faker.paket?.metode_pengadaan ||
                          faker.metode_pengadaan ||
                          "Tender Terbuka"}
                      </div>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-slate-600 dark:text-slate-300">
                      {satker}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 font-semibold text-emerald-600 dark:text-emerald-400">
                      Rp {Number(nilai).toLocaleString("id-ID")}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          status === "Aktif" || status === "Pendaftaran"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : status === "Evaluasi"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                            : status === "Masa Sanggah"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                            : "bg-slate-100 text-slate-800 dark:bg-darkmode-400 dark:text-slate-300"
                        }`}
                      >
                        {status}
                      </span>
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed text-xs text-slate-500 dark:bg-darkmode-600 whitespace-nowrap">
                      {tgl}
                    </Table.Td>
                    <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs px-3 py-1.5"
                        onClick={() =>
                          navigate(`/dashboard/lelang/show/${faker.id}`)
                        }
                      >
                        <Lucide icon="FileSearch" className="w-3.5 h-3.5 mr-1" />
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
    </>
  );
}

export default MainTable;
