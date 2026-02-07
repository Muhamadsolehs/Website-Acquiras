import React, { useState } from "react";
import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect, FormTextarea, FormHelp } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import { FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import paketFakers, { Paket } from "@/fakers/paket";
import companyFakers, { CompanyIdentity } from "@/fakers/company";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";

interface Penagihan {
  id: number;
  vendor: CompanyIdentity;
  tanggalPenagihan: Date;
  noPenagihan: string;
  jumlah: number;
  deadline: Date;
  keterangan: string;
  dokumentasi: string;
  status: "baru" | "dikirim" | "dibayar" | "overdue" | "tertunda";
}

const PenagihanAction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"pengumuman" | "penagihan">("pengumuman");
  const [showForm, setShowForm] = useState(false);

  const paket = paketFakers.fakePaket()[0];
  const vendors = companyFakers.fakeCompanyIdentities();

  const [formData, setFormData] = useState({
    vendorId: "",
    noPenagihan: "",
    jumlah: "",
    deadline: "",
    keterangan: "",
  });

  const penagihanList: Penagihan[] = [
    {
      id: 1,
      vendor: vendors[0],
      tanggalPenagihan: new Date("2024-02-05"),
      noPenagihan: "PG-001/2024",
      jumlah: 500000000,
      deadline: new Date("2024-02-20"),
      keterangan: "Pembayaran tahap pertama",
      dokumentasi: "dokumen_penagihan_001.pdf",
      status: "dikirim",
    },
    {
      id: 2,
      vendor: vendors[1],
      tanggalPenagihan: new Date("2024-02-06"),
      noPenagihan: "PG-002/2024",
      jumlah: 750000000,
      deadline: new Date("2024-02-25"),
      keterangan: "Pembayaran tahap kedua",
      dokumentasi: "dokumen_penagihan_002.pdf",
      status: "baru",
    },
    {
      id: 3,
      vendor: vendors[0],
      tanggalPenagihan: new Date("2024-01-20"),
      noPenagihan: "PG-003/2024",
      jumlah: 250000000,
      deadline: new Date("2024-02-03"),
      keterangan: "Pembayaran tahap ketiga",
      dokumentasi: "dokumen_penagihan_003.pdf",
      status: "overdue",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPenagihan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      vendorId: "",
      noPenagihan: "",
      jumlah: "",
      deadline: "",
      keterangan: "",
    });
    setShowForm(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "baru":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "dikirim":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "dibayar":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "overdue":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "tertunda":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "baru":
        return "Baru";
      case "dikirim":
        return "Dikirim";
      case "dibayar":
        return "Dibayar";
      case "overdue":
        return "Overdue";
      case "tertunda":
        return "Tertunda";
      default:
        return status;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 dark:text-white mb-2">
              Penagihan
            </h1>
            <p className="text-gray-100 dark:text-gray-400 mb-3">
              {paket.nama_paket}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Lucide icon="DollarSign" className="w-4 h-4 mr-1" />
                Penagihan Aktif
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/lelang/penagihan")}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4" />
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Penagihan
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {penagihanList.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Nominal
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Rp {penagihanList.reduce((sum, p) => sum + p.jumlah, 0).toLocaleString("id-ID")}M
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200/60 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Overdue
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {penagihanList.filter((p) => p.status === "overdue").length}
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
              onClick={() => setActiveTab("penagihan")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "penagihan"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              <Lucide icon="DollarSign" className="w-4 h-4 inline mr-2" />
              Penagihan ({penagihanList.length})
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {activeTab === "pengumuman" && (
            <PengumumanTab paket={paket} />
          )}

          {activeTab === "penagihan" && (
            <PenagihanTab
              paket={paket}
              penagihanList={penagihanList}
              showForm={showForm}
              setShowForm={setShowForm}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmitPenagihan={handleSubmitPenagihan}
              vendors={vendors}
              getStatusBadgeColor={getStatusBadgeColor}
              getStatusLabel={getStatusLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface PengumumanTabProps {
  paket: Paket;
}

const PengumumanTab: React.FC<PengumumanTabProps> = ({ paket }) => (
  <div className="p-6 space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Informasi Lelang
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-darkmode-400 p-6 rounded-lg">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nama Paket
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">{paket.nama_paket}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Kode Paket
          </label>
          <p className="mt-2 text-blue-600 dark:text-blue-400 font-mono">
            {paket.kode_paket}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Satker
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">{paket.satker}</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Lokasi
          </label>
          <p className="mt-2 text-gray-900 dark:text-white">{paket.lokasi}</p>
        </div>
      </div>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
            Tahap
          </label>
          <p className="mt-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {paket.tahap}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface PenagihanTabProps {
  paket: Paket;
  penagihanList: Penagihan[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  formData: {
    vendorId: string;
    noPenagihan: string;
    jumlah: string;
    deadline: string;
    keterangan: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitPenagihan: (e: React.FormEvent) => void;
  vendors: CompanyIdentity[];
  getStatusBadgeColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const PenagihanTab: React.FC<PenagihanTabProps> = ({
  paket,
  penagihanList,
  showForm,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmitPenagihan,
  vendors,
  getStatusBadgeColor,
  getStatusLabel,
}) => (
  <div className="p-6 space-y-6">
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Input Penagihan
        </h2>
        <Button
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Lucide icon={showForm ? "X" : "Plus"} className="w-4 h-4" />
          {showForm ? "Tutup" : "Tambah Penagihan"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmitPenagihan}
          className="bg-slate-50 dark:bg-darkmode-400 border border-slate-200 dark:border-gray-700 rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Vendor
              </label>
              <FormSelect
                name="vendorId"
                value={formData.vendorId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Pilih Vendor --</option>
                {vendors && vendors.length > 0 && vendors.map((vendor) => (
                  <option key={vendor?.idvendor} value={vendor?.idvendor}>
                    {vendor?.name || "Nama Vendor Tidak Tersedia"}
                  </option>
                ))}
              </FormSelect>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Nomor Penagihan
              </label>
              <FormInput
                type="text"
                name="noPenagihan"
                value={formData.noPenagihan}
                onChange={handleInputChange}
                placeholder="Contoh: PG-001/2024"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Jumlah (Rp)
              </label>
              <FormInput
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Deadline Pembayaran
              </label>
              <FormInput
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Keterangan
              </label>
              <FormTextarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                placeholder="Jelaskan detail penagihan..."
                rows={3}
                required
              />
              <FormHelp>Maksimal 2000 karakter</FormHelp>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowForm(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary">
                <Lucide icon="Save" className="w-4 h-4 mr-2" />
                Simpan Penagihan
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>

    {/* Daftar Penagihan */}
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Daftar Penagihan
      </h2>

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
                Vendor
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No. Penagihan
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Jumlah
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Deadline
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
            {penagihanList.map((penagihan, index) => (
              <Table.Tr key={penagihan.id} className="[&_td]:last:border-b-0">
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <FormCheck.Input type="checkbox" />
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {index + 1}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {penagihan.vendor?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ID: {penagihan.vendor?.idvendor || "N/A"}
                  </div>
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-blue-700 dark:text-blue-400 font-mono">
                  {penagihan.noPenagihan}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-lg font-semibold">
                  Rp {penagihan.jumlah.toLocaleString("id-ID")}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-sm">
                  {new Date(penagihan.deadline).toLocaleDateString("id-ID")}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      penagihan.status
                    )}`}
                  >
                    {getStatusLabel(penagihan.status)}
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
                          Lihat Detail
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Download" className="w-4 h-4 mr-2" />
                          Unduh Dokumen
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="CheckCircle" className="w-4 h-4 mr-2" />
                          Tandai Dibayar
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Clock" className="w-4 h-4 mr-2" />
                          Perpanjang Deadline
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

      {penagihanList.length === 0 && (
        <div className="text-center py-8">
          <Lucide icon="DollarSign" className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Tidak ada penagihan</p>
        </div>
      )}

      {/* Pagination */}
      {penagihanList.length > 0 && (
        <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
          <Pagination className="flex-1 w-full mr-auto sm:w-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link active>1</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
        </div>
      )}
    </div>
  </div>
);

export default PenagihanAction;
