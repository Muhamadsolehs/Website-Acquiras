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
import { useNavigate, useParams } from "react-router-dom";

const ShowDetailLelang: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"pengumuman" | "peserta">("pengumuman");

  const paket = paketFakers.fakePaket()[0];
  const vendors = companyFakers.fakeCompanyIdentities();

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 dark:text-white mb-2">
              {paket.nama_paket}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => navigate("/master-lelang")}
            >
              <Lucide icon="ArrowLeft" className="w-4 h-4" />
              Kembali
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate(`/master-lelang/edit/${id}`)}
            >
              <Lucide icon="PenLine" className="w-4 h-4" />
              Edit
            </Button>
            {/* <Menu>
              <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300/80 bg-white/80 hover:bg-slate-50 dark:bg-darkmode-400 dark:border-darkmode-300 dark:hover:bg-darkmode-500">
                <Lucide icon="MoreVertical" className="w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item>
                  <Lucide icon="Copy" className="w-4 h-4 mr-2" />
                  Duplikasi
                </Menu.Item>
                <Menu.Item className="text-danger">
                  <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                  Hapus
                </Menu.Item>
              </Menu.Items>
            </Menu> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nilai Lelang</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Rp {(paket.nilai / 1000000000).toFixed(1)}M
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harga</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Rp {(paket.harga / 1000000000).toFixed(1)}M
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Peserta</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {vendors.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bobot</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              T: {paket.bobot_teknis}% | H: {paket.bobot_harga}%
            </div>
          </div>
        </div>

        <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("pengumuman")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "pengumuman"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
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
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              <Lucide icon="Users" className="w-4 h-4 inline mr-2" />
              Peserta ({vendors.length})
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {activeTab === "pengumuman" && (
            <PengumumanTabAdmin paket={paket} />
          )}

          {activeTab === "peserta" && (
            <PesertaTabAdmin vendors={vendors} />
          )}
        </div>
      </div>
    </div>
  );
};

interface PengumumanTabAdminProps {
  paket: Paket;
}

const PengumumanTabAdmin: React.FC<PengumumanTabAdminProps> = ({ paket }) => (
  <div className="p-6 space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lucide icon="FileText" className="w-5 h-5" />
        Informasi Dasar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-darkmode-400 p-6 rounded-lg">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nama Paket
          </label>
          <p className="mt-2 text-gray-900 dark:text-white font-medium">
            {paket.nama_paket}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Kode Paket
          </label>
          <p className="mt-2 text-blue-600 dark:text-blue-400 font-mono font-medium">
            {paket.kode_paket}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Satker
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.satker}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tahun Anggaran
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.tahun_anggaran}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Lokasi
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.lokasi}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tahap Saat Ini
          </label>
          <p className="mt-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {paket.tahap}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lucide icon="Settings" className="w-5 h-5" />
        Detail Lelang
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-darkmode-400 p-6 rounded-lg">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Paket
          </label>
          <p className="mt-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 capitalize">
              {paket.jenis_paket}
            </span>
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Kontrak
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.jenis_kontrak}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Jenis Pengadaan
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.jenis_pengadaan}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Metode Pengadaan
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.metode_pengadaan}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nilai Lelang
          </label>
          <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
            Rp {paket.nilai.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Harga
          </label>
          <p className="mt-2 text-lg font-bold text-green-600 dark:text-green-400">
            Rp {paket.harga.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>

    {/* <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lucide icon="BarChart3" className="w-5 h-5" />
        Kriteria Penilaian
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold mb-2">
            Bobot Teknis
          </div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {paket.bobot_teknis}%
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
              style={{ width: `${paket.bobot_teknis}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">
            Bobot Harga
          </div>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">
            {paket.bobot_harga}%
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
              style={{ width: `${paket.bobot_harga}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div> */}

    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lucide icon="ClipboardList" className="w-5 h-5" />
        Syarat & Ketentuan
      </h2>
      <div className="bg-slate-50 dark:bg-darkmode-400 p-6 rounded-lg border border-slate-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Syarat Peserta
            </label>
            <p className="mt-2 text-gray-900 dark:text-white leading-relaxed">
              {paket.syarat}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Lucide icon="BookOpen" className="w-5 h-5" />
        Informasi RUP
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-darkmode-400 p-6 rounded-lg">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Kode RUP
          </label>
          <p className="mt-2 text-gray-900 dark:text-white font-mono">
            {paket.rup.kode_rup}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Sumber Dana
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">
            {paket.rup.sumber_dana}
          </p>
        </div>
      </div>
    </div>

    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Dibuat:</span>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date(paket.dateCreated).toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">Diperbarui:</span>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {new Date(paket.dateUpdated).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface PesertaTabAdminProps {
  vendors: CompanyIdentity[];
}

const PesertaTabAdmin: React.FC<PesertaTabAdminProps> = ({ vendors }) => (
  <div className="p-6">
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Lucide icon="Users" className="w-5 h-5" />
          Daftar Peserta Lelang
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total {vendors.length} vendor terdaftar
        </p>
      </div>
      <Button variant="primary" className="flex items-center gap-2">
        <Lucide icon="Plus" className="w-4 h-4" />
        Tambah Peserta
      </Button>
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
            <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
              Status
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
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {vendor.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {vendor.website}
                  </div>
                </div>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <span className="text-blue-700 dark:text-blue-400 font-semibold font-mono">
                  {vendor.idvendor}
                </span>
              </Table.Td>
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
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
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  Terdaftar
                </span>
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
                    <Menu.Items className="w-48">
                      <Menu.Item>
                        <Lucide icon="Eye" className="w-4 h-4 mr-2" />
                        Lihat Detail Vendor
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Download" className="w-4 h-4 mr-2" />
                        Lihat Dokumen
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />
                        Lihat Penawaran
                      </Menu.Item>
                      <Menu.Item className="text-danger">
                        <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                        Hapus dari Lelang
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

export default ShowDetailLelang;
