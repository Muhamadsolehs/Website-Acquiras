import _ from "lodash";

export interface Permohonan {
  id: string;
  no_ticket: string;
  title: string;
  date: string;
  status: string;
  pemohon?: Pemohon;
  ahli?: Ahli;
}

export interface Pemohon {
    id: string;
    name: string;
    email: string;
    no: string;
    instance: string;
    satker: string;
    status: boolean;
}

export interface Ahli {
    id: string;
    name: string;
    email: string;
    no: string;
    position: string;
    province: string;
    date_login: string;
}

const fakers = {
  fakePermohonans() {
    const permohonan: Permohonan[] = [
        {
            id: "1",
            no_ticket: "SM202512200001",
            title: "Renovasi Tempat Siaga",
            date: "2021-01-01",
            status: "pending",
            pemohon: {
                id: "1",
                name: "John Doe 1",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                instance: "SM",
                satker: "Satker 1",
                status: true,
            },
            ahli: {
                id: "1",
                name: "John Doe 1 Ahli",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                position: "Manager",
                province: "Jakarta",
                date_login: "2021-01-01",
            },
        },
        {
            id: "2",
            no_ticket: "SM202512200002",
            title: "Gangguan mesin produksi",
            date: "2021-01-01",
            status: "success",
            pemohon: {
                id: "2",
                name: "John Doe 2",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                instance: "SM",
                satker: "Satker 1",
                status: false,
            },
            ahli: {
                id: "2",
                name: "John Doe 2 Ahli",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                position: "Manager",
                province: "Jakarta",
                date_login: "2021-01-01",
            },
        },
        {
            id: "3",
            no_ticket: "SM202512200003",
            title: "Gangguan mesin produksi A",
            date: "2021-01-01",
            status: "success",
            pemohon: {
                id: "3",
                name: "John Doe 3",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                instance: "SM",
                satker: "Satker 1",
                status: false,
            },
            ahli: {
                id: "3",
                name: "John Doe 3 Ahli",
                email: "Fj9Oj@example.com",
                no: "1234567890",
                position: "Manager",
                province: "Jakarta",
                date_login: "2021-01-01",
            },
        },
    ];
    return _.shuffle(permohonan);
  },
};

export default fakers;
