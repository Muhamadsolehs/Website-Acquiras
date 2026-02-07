import _ from "lodash";
import { User } from "./users";
import userFakers from "./users";

export interface CompanyPermissionBusiness {
  typeBusiness: string;
  typeDate: boolean;
  validUntil: Date | string;
  clasfication: string;
  dateCreated: Date;
  dateUpdated: Date;
  noLetter: string;
  givenBy: string;
  qualified: string;
  sourceData: string;
}

export interface CompanyAkta {
  nomor: number;
  dateLetter: Date;
  notaris: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface Owner {
  typeOwner: number;
  name: string;
  citizenship: string;
  noKtp: string;
  noNpwp: string;
  address: string;
  province: string;
  regency: string;
  saham: number;
  unitSaham: boolean;
}
export interface Management {
  typeManagement: number;
  citizenship: string;
  name: string;
  nik_pasport: string;
  noNpwp: string;
  noBpjskesehatan: string;
  noBpjsketenagan: string;
  address: string;
  province: string;
  regency: string;
  position: string;
  status: boolean;
  since: Date;
  sinceEnd: Date | null;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface Team {
  typeTeam: number;
  typeTA: string;
  name: string;
  placeBirth: string;
  regencyBirth: string;
  dateBirth: Date;
  phone: string;
  email: string;
  website: string;
  address: string;
  province: string;
  regency: string;
  nik_pasport: number;
  noNpwp: string;
  gender: string;
  citizenship: string;
  noBpjskesehatan: string;
  noBpjsketenagan: string;
  education: string;
  experience: string;
  statusWork: boolean;
  position: string;
  profession: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface Experience {
  nameContract: string;
  typeWork: string;
  locationWork: string;
  instance: string;
  unitWork: string;
  phoneInstance: string;
  noContract: string;
  valueContract: number;
  percentageWork: number;
  dateWorkStart: Date;
  dateWorkEnd: Date;
  dateHandover: Date;
  scopeWork: string;
  descWork: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface WorkEquipment {
  nameEquipment: string;
  quantity: number;
  capacity: string;
  typeEquipment: string;
  yearMade: number;
  condition: string;
  location: string;
  ownership: string;
  proofOwnership: string;
  information: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface CompanyIdentity {
  idvendor: number;
  users: User[];
  name: string;
  address: string;
  postalcode: string;
  province: string;
  city: string;
  regency: string;
  dateNpwp: Date;
  dateKswp: Date;
  dateUpdate: Date;
  kswpValid: boolean;
  noPkp: string;
  phone: string;
  noFax: string;
  website: string;
  qualified: string;
  permission: CompanyPermissionBusiness;
  akta: CompanyAkta;
  owners: Owner[];
  managements: Management[];
  teams: Team[];
  experiences: Experience[];
  workEquipments: WorkEquipment[];
}

const fakers = {
  fakeCompanyIdentities() {
    const companyIdentities: Array<CompanyIdentity> = [
      {
        idvendor: 150667,
        users: userFakers.fakeUsers(),
        name: "PT Maju Jaya",
        address: "Jl. Sudirman No. 1",
        postalcode: "40111",
        province: "Jawa Barat",
        city: "Bandung",
        regency: "Bandung",
        dateNpwp: new Date(),
        dateKswp: new Date(),
        dateUpdate: new Date(),
        kswpValid: true,
        noPkp: "01.234.567.8-999.000",
        phone: "08123456789",
        noFax: "022123456",
        website: "https://majujaya.co.id",
        qualified: "Besar",
        permission: {
          typeBusiness: "SIUP",
          typeDate: true,
          validUntil: new Date(),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
          clasfication: "Kecil",
          dateCreated: new Date(),
          dateUpdated: new Date(),
          noLetter: "SIUP-001/MAJUJAYA/2024",
          givenBy: "Dinas Perdagangan Bandung",
          qualified: "Besar",
          sourceData: "Online",
        },
        akta: {
        
          nomor: 12345,
          dateLetter: new Date(),
          notaris: "Notaris A",
          dateCreated: new Date(),
          dateUpdated: new Date(),
        },
        owners: [
          {
            typeOwner: 1,
            name: "Budi Santoso",
            citizenship: "Indonesia",
            noKtp: "3172012345678901",
            noNpwp: "01.234.567.8-999.000",
            address: "Jl. Merdeka No. 10, Bandung",
            province: "Jawa Barat",
            regency: "Bandung",
            saham: 70,
            unitSaham: true,
          },
          {
            typeOwner: 2,
            name: "Siti Aminah",
            citizenship: "Indonesia",
            noKtp: "3172012345678902",
            noNpwp: "01.234.567.8-999.001",
            address: "Jl. Merdeka No. 11, Bandung",
            province: "Jawa Barat",
            regency: "Bandung",
            saham: 30,
            unitSaham: true,
          },
        ],
        managements: [
          {
            typeManagement: 1,
            citizenship: "Indonesia",
            name: "Andi Pratama",
            nik_pasport: "3172012345678903",
            noNpwp: "01.234.567.8-999.002",
            noBpjskesehatan: "1234567890",
            noBpjsketenagan: "1234567890",
            address: "Jl. Merdeka No. 12, Bandung",
            province: "Jawa Barat",
            regency: "Bandung",
            position: "Manajer Pengadaan",
            status: true,
            since: new Date(),
            sinceEnd: null,
            dateCreated: new Date(),
            dateUpdated: new Date(),
          },
        ],
        teams: [
          {
            typeTeam: 1,
            typeTA: "Teknis",
            citizenship: "Indonesia",
            name: "Budi Santoso",
            placeBirth: "Bandung",
            regencyBirth: "Bandung",
            dateBirth: new Date(),
            phone: "08123456789",
            email: "budi.santoso@mail.com",
            website: "https://budiportfolio.com",
            address: "Jl. Merdeka No. 10, Bandung",
            province: "Jawa Barat",
            regency: "Bandung",
            nik_pasport: 3172012345678901,
            noNpwp: "01.234.567.8-999.000",
            gender: "Laki-laki",
            noBpjskesehatan: "1234567890",
            noBpjsketenagan: "1234567890",
            education: "S1 Teknik Sipil",
            experience: "5 tahun di bidang konstruksi",
            statusWork: true,
            position: "Supervisor",
            profession: "Insinyur Sipil",
            dateCreated: new Date(),
            dateUpdated: new Date(),
          },
        ],
        experiences: [
          {
            nameContract: "Konsultan Konstruksi",
            typeWork: "Konstruksi",
            locationWork: "Bandung",
            instance: "PT Maju Jaya",
            unitWork: "PT Maju Jaya",
            phoneInstance: "08123456789",
            noContract: "01.234.567.8-999.000",
            valueContract: 500000000,
            percentageWork: 100,
            dateWorkStart: new Date(),
            dateWorkEnd: new Date(),
            dateHandover: new Date(),
            scopeWork: "Pembangunan Gedung",
            descWork: "Pembangunan gedung perkantoran 5 lantai",
            dateCreated: new Date(),
            dateUpdated: new Date(),
          },
        ],
        workEquipments: [
          {
            nameEquipment: "Peralatan Kerja",
            quantity: 5,
            capacity: "5 orang",
            typeEquipment: "Peralatan Kerja",
            yearMade: 2020,
            condition: "Baik",
            ownership: "Sendiri",
            proofOwnership: "Surat Kepemilikan",
            information: "Peralatan kerja untuk proyek konstruksi",
            location: "Gedung A",
            dateCreated: new Date(),
            dateUpdated: new Date(),
          },
        ],
      },
    ];

    return _.shuffle(companyIdentities);
  },
};

export default fakers;
