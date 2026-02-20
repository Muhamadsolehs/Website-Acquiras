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

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 dark:border-darkmode-400 dark:bg-darkmode-800 dark:text-slate-100";

const IdentitasTab: React.FC<IdentitasTabProps> = ({ company }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nama Perusahaan
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.name}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          ID Vendor
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={String(company.idvendor)}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Alamat
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.address}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kode Pos
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.postalcode}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Provinsi
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.province}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kabupaten
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.regency}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Telepon
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.phone}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Fax
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.noFax}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Website
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.website}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Kualifikasi
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={company.qualified}
        />
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
        <input
          type="text"
          className={inputClass}
          defaultValue={permission.typeBusiness}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Nomor Surat
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={permission.noLetter}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Diberikan Oleh
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={permission.givenBy}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Klasifikasi
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={permission.clasfication}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Berlaku Hingga
        </label>
        <input
          type="date"
          className={inputClass}
          defaultValue={new Date(permission.validUntil).toISOString().slice(0, 10)}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Sumber Data
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={permission.sourceData}
        />
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
        <input
          type="text"
          className={inputClass}
          defaultValue={akta.nomor}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tanggal Surat
        </label>
        <input
          type="date"
          className={inputClass}
          defaultValue={new Date(akta.dateLetter).toISOString().slice(0, 10)}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Notaris
        </label>
        <input
          type="text"
          className={inputClass}
          defaultValue={akta.notaris}
        />
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
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama</label>
                  <input type="text" className={inputClass} defaultValue={owner.name} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kewarganegaraan</label>
                  <input type="text" className={inputClass} defaultValue={owner.citizenship} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. KTP</label>
                  <input type="text" className={inputClass} defaultValue={owner.noKtp} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. NPWP</label>
                  <input type="text" className={inputClass} defaultValue={owner.noNpwp} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Alamat</label>
                  <input type="text" className={inputClass} defaultValue={owner.address} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Provinsi</label>
                  <input type="text" className={inputClass} defaultValue={owner.province} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kabupaten</label>
                  <input type="text" className={inputClass} defaultValue={owner.regency} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Saham (%)</label>
                  <input type="number" className={inputClass} defaultValue={owner.saham} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Tidak ada data pemilik</p>
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
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama</label>
                  <input type="text" className={inputClass} defaultValue={management.name} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posisi</label>
                  <input type="text" className={inputClass} defaultValue={management.position} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kewarganegaraan</label>
                  <input type="text" className={inputClass} defaultValue={management.citizenship} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">NIK/Paspor</label>
                  <input type="text" className={inputClass} defaultValue={management.nik_pasport} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. NPWP</label>
                  <input type="text" className={inputClass} defaultValue={management.noNpwp} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. BPJS Kesehatan</label>
                  <input type="text" className={inputClass} defaultValue={management.noBpjskesehatan} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. BPJS Ketenagakerjaan</label>
                  <input type="text" className={inputClass} defaultValue={management.noBpjsketenagan} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Alamat</label>
                  <input type="text" className={inputClass} defaultValue={management.address} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Provinsi</label>
                  <input type="text" className={inputClass} defaultValue={management.province} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kabupaten</label>
                  <input type="text" className={inputClass} defaultValue={management.regency} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sejak</label>
                  <input
                    type="date"
                    className={inputClass}
                    defaultValue={new Date(management.since).toISOString().slice(0, 10)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    className={inputClass}
                    defaultValue={management.status ? "1" : "0"}
                  >
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Tidak ada data kepengurusan</p>
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
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama</label>
              <input type="text" className={inputClass} defaultValue={team.name} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profesi</label>
              <input type="text" className={inputClass} defaultValue={team.profession} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posisi</label>
              <input type="text" className={inputClass} defaultValue={team.position} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tempat Lahir</label>
              <input type="text" className={inputClass} defaultValue={team.placeBirth} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
              <input type="date" className={inputClass} defaultValue={new Date(team.dateBirth).toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
              <input type="text" className={inputClass} defaultValue={team.gender} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kewarganegaraan</label>
              <input type="text" className={inputClass} defaultValue={team.citizenship} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">NIK/Paspor</label>
              <input type="text" className={inputClass} defaultValue={team.nik_pasport} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. NPWP</label>
              <input type="text" className={inputClass} defaultValue={team.noNpwp} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. BPJS Kesehatan</label>
              <input type="text" className={inputClass} defaultValue={team.noBpjskesehatan} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. BPJS Ketenagakerjaan</label>
              <input type="text" className={inputClass} defaultValue={team.noBpjsketenagan} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" className={inputClass} defaultValue={team.email} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telepon</label>
              <input type="text" className={inputClass} defaultValue={team.phone} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pendidikan</label>
              <input type="text" className={inputClass} defaultValue={team.education} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pengalaman</label>
              <input type="text" className={inputClass} defaultValue={team.experience} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Alamat</label>
              <input type="text" className={inputClass} defaultValue={team.address} />
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
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Kontrak</label>
              <input type="text" className={inputClass} defaultValue={exp.nameContract} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis Pekerjaan</label>
              <input type="text" className={inputClass} defaultValue={exp.typeWork} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lokasi Pekerjaan</label>
              <input type="text" className={inputClass} defaultValue={exp.locationWork} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Instansi</label>
              <input type="text" className={inputClass} defaultValue={exp.instance} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unit Pekerjaan</label>
              <input type="text" className={inputClass} defaultValue={exp.unitWork} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telepon Instansi</label>
              <input type="text" className={inputClass} defaultValue={exp.phoneInstance} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">No. Kontrak</label>
              <input type="text" className={inputClass} defaultValue={exp.noContract} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nilai Kontrak</label>
              <input type="text" className={inputClass} defaultValue={`Rp ${exp.valueContract.toLocaleString("id-ID")}`} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Persentase Pekerjaan (%)</label>
              <input type="number" className={inputClass} defaultValue={exp.percentageWork} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Mulai</label>
              <input type="date" className={inputClass} defaultValue={new Date(exp.dateWorkStart).toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Selesai</label>
              <input type="date" className={inputClass} defaultValue={new Date(exp.dateWorkEnd).toISOString().slice(0, 10)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Serah Terima</label>
              <input type="date" className={inputClass} defaultValue={new Date(exp.dateHandover).toISOString().slice(0, 10)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ruang Lingkup Pekerjaan</label>
              <input type="text" className={inputClass} defaultValue={exp.scopeWork} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deskripsi Pekerjaan</label>
              <textarea className={inputClass} rows={3} defaultValue={exp.descWork} />
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600 dark:text-gray-400">Tidak ada data pengalaman</p>
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
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Peralatan</label>
              <input type="text" className={inputClass} defaultValue={equipment.nameEquipment} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis Peralatan</label>
              <input type="text" className={inputClass} defaultValue={equipment.typeEquipment} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kuantitas</label>
              <input type="text" className={inputClass} defaultValue={String(equipment.quantity)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kapasitas</label>
              <input type="text" className={inputClass} defaultValue={equipment.capacity} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tahun Pembuatan</label>
              <input type="text" className={inputClass} defaultValue={equipment.yearMade} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kondisi</label>
              <input type="text" className={inputClass} defaultValue={equipment.condition} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lokasi</label>
              <input type="text" className={inputClass} defaultValue={equipment.location} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kepemilikan</label>
              <input type="text" className={inputClass} defaultValue={equipment.ownership} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bukti Kepemilikan</label>
              <input type="text" className={inputClass} defaultValue={equipment.proofOwnership} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Informasi</label>
              <textarea className={inputClass} rows={3} defaultValue={equipment.information} />
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600 dark:text-gray-400">Tidak ada data peralatan</p>
    )}
  </div>
);

export default DataVendor;
