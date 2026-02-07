import React, { useState } from "react";
import companyFakers from "../../fakers/company";
import {
  CompanyIdentity,
  Owner,
  Management,
  Team,
  Experience,
  WorkEquipment,
} from "../../fakers/company";

const DataVendor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("identitas");
  const [activeManajerialTab, setActiveManajerialTab] = useState<string>("owner");
  const company = companyFakers.fakeCompanyIdentities()[0];

  const tabs = [
    { id: "identitas", label: "Identitas" },
    { id: "izin-usaha", label: "Izin Usaha" },
    { id: "akta", label: "Akta" },
    { id: "manajerial", label: "Manajerial" },
    { id: "sdm", label: "SDM" },
    { id: "pengalaman", label: "Pengalaman" },
    { id: "peralatan", label: "Peralatan" },
  ];

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 dark:text-white mb-2">
          Data Vendor
        </h1>
        <p className="text-gray-100 dark:text-gray-400">
          Informasi lengkap vendor PT Maju Jaya
        </p>
      </div>

      <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "manajerial") {
                  setActiveManajerialTab("owner");
                }
              }}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-100 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {activeTab === "identitas" && (
          <IdentitasTab company={company} />
        )}

        {activeTab === "izin-usaha" && (
          <IzinUsahaTab permission={company.permission} />
        )}

        {activeTab === "akta" && (
          <AktaTab akta={company.akta} />
        )}

        {activeTab === "manajerial" && (
          <ManajerialTab
            managements={company.managements}
            owners={company.owners}
            activeManajerialTab={activeManajerialTab}
            setActiveManajerialTab={setActiveManajerialTab}
          />
        )}

        {activeTab === "sdm" && (
          <SDMTab teams={company.teams} />
        )}

        {activeTab === "pengalaman" && (
          <PengalamanTab experiences={company.experiences} />
        )}

        {activeTab === "peralatan" && (
          <PeralatanTab workEquipments={company.workEquipments} />
        )}
      </div>
    </div>
  );
};


interface IdentitasTabProps {
  company: CompanyIdentity;
}

const IdentitasTab: React.FC<IdentitasTabProps> = ({ company }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nama Perusahaan
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.name}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          ID Vendor
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.idvendor}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Alamat
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.address}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kode Pos
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.postalcode}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Provinsi
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.province}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kabupaten
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.regency}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Telepon
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.phone}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Fax
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.noFax}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Website
        </label>
        <p className="mt-1 text-blue-600 dark:text-blue-400">{company.website}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kualifikasi
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{company.qualified}</p>
      </div>
    </div>
  </div>
);

interface IzinUsahaTabProps {
  permission: CompanyIdentity["permission"];
}

const IzinUsahaTab: React.FC<IzinUsahaTabProps> = ({ permission }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Jenis Izin Usaha
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">
          {permission.typeBusiness}
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nomor Surat
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{permission.noLetter}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Diberikan Oleh
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{permission.givenBy}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Klasifikasi
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">
          {permission.clasfication}
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Berlaku Hingga
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">
          {new Date(permission.validUntil).toLocaleDateString("id-ID")}
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Sumber Data
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">
          {permission.sourceData}
        </p>
      </div>
    </div>
  </div>
);

interface AktaTabProps {
  akta: CompanyIdentity["akta"];
}

const AktaTab: React.FC<AktaTabProps> = ({ akta }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nomor Akta
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{akta.nomor}</p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tanggal Surat
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">
          {new Date(akta.dateLetter).toLocaleDateString("id-ID")}
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Notaris
        </label>
        <p className="mt-1 text-gray-900 dark:text-white">{akta.notaris}</p>
      </div>
    </div>
  </div>
);

interface ManajerialTabProps {
  managements: Management[];
  owners: Owner[];
  activeManajerialTab: string;
  setActiveManajerialTab: (tab: string) => void;
}

const ManajerialTab: React.FC<ManajerialTabProps> = ({
  managements,
  owners,
  activeManajerialTab,
  setActiveManajerialTab,
}) => (
  <div className="space-y-6">
    {/* Sub-Tab Navigation for Manajerial */}
    <div className="border-b border-gray-300 dark:border-gray-700">
      <div className="flex gap-4">
        <button
          onClick={() => setActiveManajerialTab("owner")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeManajerialTab === "owner"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Pemilik
        </button>
        <button
          onClick={() => setActiveManajerialTab("kepengurusan")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeManajerialTab === "kepengurusan"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Kepengurusan
        </button>
      </div>
    </div>

    {/* Owner Sub-Tab */}
    {activeManajerialTab === "owner" && (
      <div className="space-y-4">
        {owners.length > 0 ? (
          owners.map((owner, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pemilik {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nama
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kewarganegaraan
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.citizenship}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No. KTP
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.noKtp}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No. NPWP
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.noNpwp}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Alamat
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Provinsi
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.province}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kabupaten
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.regency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Saham (%)
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {owner.saham}%
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada data pemilik
          </p>
        )}
      </div>
    )}

    {/* Kepengurusan Sub-Tab */}
    {activeManajerialTab === "kepengurusan" && (
      <div className="space-y-4">
        {managements.length > 0 ? (
          managements.map((management, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kepengurusan {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nama
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Posisi
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.position}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kewarganegaraan
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.citizenship}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    NIK/Paspor
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.nik_pasport}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No. NPWP
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.noNpwp}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No. BPJS Kesehatan
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.noBpjskesehatan}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    No. BPJS Ketenagakerjaan
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.noBpjsketenagan}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Alamat
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.address}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Provinsi
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.province}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kabupaten
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {management.regency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Sejak
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {new Date(management.since).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <p className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        management.status
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {management.status ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada data kepengurusan
          </p>
        )}
      </div>
    )}
  </div>
);

interface SDMTabProps {
  teams: Team[];
}

const SDMTab: React.FC<SDMTabProps> = ({ teams }) => (
  <div className="space-y-4">
    {teams.length > 0 ? (
      teams.map((team, index) => (
        <div
          key={index}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tim {index + 1} - {team.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">{team.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Profesi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.profession}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Posisi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.position}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tempat Lahir
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.placeBirth}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Lahir
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(team.dateBirth).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Jenis Kelamin
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.gender}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kewarganegaraan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.citizenship}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                NIK/Paspor
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.nik_pasport}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No. NPWP
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.noNpwp}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No. BPJS Kesehatan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.noBpjskesehatan}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No. BPJS Ketenagakerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.noBpjsketenagan}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-blue-600 dark:text-blue-400">
                {team.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Telepon
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.phone}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pendidikan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.education}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pengalaman
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.experience}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Alamat
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {team.address}
              </p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600 dark:text-gray-400">Tidak ada data SDM</p>
    )}
  </div>
);

interface PengalamanTabProps {
  experiences: Experience[];
}

const PengalamanTab: React.FC<PengalamanTabProps> = ({ experiences }) => (
  <div className="space-y-4">
    {experiences.length > 0 ? (
      experiences.map((exp, index) => (
        <div
          key={index}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pengalaman {index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama Kontrak
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.nameContract}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Jenis Pekerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.typeWork}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Lokasi Pekerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.locationWork}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Instansi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.instance}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Unit Pekerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.unitWork}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Telepon Instansi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.phoneInstance}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No. Kontrak
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.noContract}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nilai Kontrak
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                Rp {exp.valueContract.toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Persentase Pekerjaan (%)
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.percentageWork}%
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Mulai
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(exp.dateWorkStart).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Selesai
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(exp.dateWorkEnd).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tanggal Serah Terima
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {new Date(exp.dateHandover).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ruang Lingkup Pekerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.scopeWork}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Deskripsi Pekerjaan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {exp.descWork}
              </p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600 dark:text-gray-400">
        Tidak ada data pengalaman
      </p>
    )}
  </div>
);

interface PeralatanTabProps {
  workEquipments: WorkEquipment[];
}

const PeralatanTab: React.FC<PeralatanTabProps> = ({ workEquipments }) => (
  <div className="space-y-4">
    {workEquipments.length > 0 ? (
      workEquipments.map((equipment, index) => (
        <div
          key={index}
          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Peralatan {index + 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nama Peralatan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.nameEquipment}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Jenis Peralatan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.typeEquipment}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kuantitas
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.quantity}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kapasitas
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.capacity}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tahun Pembuatan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.yearMade}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kondisi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.condition}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Lokasi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.location}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Kepemilikan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.ownership}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bukti Kepemilikan
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.proofOwnership}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Informasi
              </label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {equipment.information}
              </p>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600 dark:text-gray-400">
        Tidak ada data peralatan
      </p>
    )}
  </div>
);

export default DataVendor;
