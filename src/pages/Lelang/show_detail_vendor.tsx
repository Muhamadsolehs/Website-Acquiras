import React, { useState } from "react";
import Lucide from "@/components/Base/Lucide";
import Table from "@/components/Base/Table";
import { FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import paketFakers, { Paket } from "@/fakers/paket";
import companyFakers, { CompanyIdentity } from "@/fakers/company";
import _ from "lodash";

interface ShowDetailVendorProps {
  lelangId?: number;
}

const ShowDetailVendor: React.FC<ShowDetailVendorProps> = ({ lelangId }) => {
  const [activeTab, setActiveTab] = useState<"pengumuman" | "peserta">("pengumuman");
  
  const paket = paketFakers.fakePaket()[0];
  const vendors = companyFakers.fakeCompanyIdentities();

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 dark:text-white mb-2">
              {paket.nama_paket}
            </h1>
            <p className="text-gray-100 dark:text-gray-400">
              Kode Paket: {paket.kode_paket}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-100 dark:text-gray-400 mb-2">
              Nilai Lelang
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {paket.nilai.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            <Lucide icon="AlertCircle" className="w-4 h-4 mr-1" />
            {paket.tahap}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
            {paket.jenis_paket === "tender" ? "Tender" : "Non Tender"}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {paket.metode_pengadaan}
          </span>
        </div>
      </div>

      <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("pengumuman")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "pengumuman"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-900 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <Lucide icon="Megaphone" className="w-4 h-4 inline mr-2" />
            Pengumuman
          </button>
          <button
            onClick={() => setActiveTab("peserta")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "peserta"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-900 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          >
            <Lucide icon="Users" className="w-4 h-4 inline mr-2" />
            Peserta ({vendors.length})
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {activeTab === "pengumuman" && (
          <PengumumanTab paket={paket} />
        )}

        {activeTab === "peserta" && (
          <PesertaTab vendors={vendors} />
        )}
      </div>
    </div>
  );
};

interface PengumumanTabProps {
  paket: Paket;
}

const PengumumanTab: React.FC<PengumumanTabProps> = ({ paket }) => (
  <div className="p-6 space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Informasi Lelang
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nama Paket
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.nama_paket}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Kode Paket
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.kode_paket}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Satker
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.satker}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tahun Anggaran
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.tahun_anggaran}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Lokasi
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.lokasi}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tahap
          </label>
          <p className="mt-1">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {paket.tahap}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Detail Lelang
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Paket
          </label>
          <p className="mt-1">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 capitalize">
              {paket.jenis_paket}
            </span>
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Kontrak
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.jenis_kontrak}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Pengadaan
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.jenis_pengadaan}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Metode Pengadaan
          </label>
          <p className="mt-1 text-gray-900 dark:text-white">{paket.metode_pengadaan}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nilai Lelang
          </label>
          <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
            Rp {paket.nilai.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Harga
          </label>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            Rp {paket.harga.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>

    {/* <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Kriteria Penilaian
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Bobot Teknis
          </label>
          <p className="mt-1">
            <span className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold text-lg">
              {paket.bobot_teknis}%
            </span>
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Bobot Harga
          </label>
          <p className="mt-1">
            <span className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 font-semibold text-lg">
              {paket.bobot_harga}%
            </span>
          </p>
        </div>
      </div>
    </div> */}

    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Informasi Tambahan
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Syarat Peserta
          </label>
          <p className="mt-1 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded">
            {paket.syarat}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Kode RUP
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{paket.rup.kode_rup}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Sumber Dana
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{paket.rup.sumber_dana}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span className="font-semibold">Dibuat:</span>{" "}
          {new Date(paket.dateCreated).toLocaleString("id-ID")}
        </div>
        <div>
          <span className="font-semibold">Diperbarui:</span>{" "}
          {new Date(paket.dateUpdated).toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  </div>
);

interface PesertaTabProps {
  vendors: CompanyIdentity[];
}

const PesertaTab: React.FC<PesertaTabProps> = ({ vendors }) => (
  <div className="p-6">
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Daftar Peserta Lelang
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Total {vendors.length} vendor terdaftar
      </p>
    </div>

    <div className="overflow-auto">
      <Table className="border-b border-slate-200/60">
        <Table.Thead>
          <Table.Tr>
            <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              <FormCheck.Input type="checkbox" />
            </Table.Td>
            <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              No
            </Table.Td>
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Nama Vendor
            </Table.Td>
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              ID Vendor
            </Table.Td>
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Kualifikasi
            </Table.Td>
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Lokasi
            </Table.Td>
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Telepon
            </Table.Td>
            <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Aksi
            </Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {_.take(vendors, 10).map((vendor, index) => (
            <Table.Tr key={vendor.idvendor} className="[&_td]:last:border-b-0">
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <FormCheck.Input type="checkbox" />
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                {index + 1}
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {vendor.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {vendor.website}
                </div>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-blue-700 dark:text-blue-400 font-semibold">
                {vendor.idvendor}
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  {vendor.qualified}
                </span>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <div className="text-sm text-gray-900 dark:text-white">
                  {vendor.city}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {vendor.province}
                </div>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <a
                  href={`tel:${vendor.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {vendor.phone}
                </a>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <div className="flex items-center justify-center">
                  <Menu className="h-5">
                    <Menu.Button className="w-5 h-5 text-slate-500">
                      <Lucide
                        icon="MoreVertical"
                        className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Eye" className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Download" className="w-4 h-4 mr-2" />
                        Unduh Dokumen
                      </Menu.Item>
                      <Menu.Item className="text-danger">
                        <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                        Hapus
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
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
    </div>
  </div>
);

export default ShowDetailVendor;
