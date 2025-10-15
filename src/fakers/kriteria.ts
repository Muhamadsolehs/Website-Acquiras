import _ from "lodash";

export interface Kriteria {
  id: string;
  name: string;
  status: boolean;
}

const fakers = {
  fakeKriterias() {
    const kriteria: Kriteria[] = [
      { id: "1", name: "Pengetahuan PBJ Kurang", status: true },
      { id: "2", name: "Informasi yang disampaikan tidak relevan", status: false },
      { id: "3", name: "Memiliki Kemampuan Komunikasi yang Tidak Baik", status: true },
      { id: "4", name: "Tidak Mampu Menjaga Rahasia", status: true },
      { id: "5", name: "Berperilaku Kasar", status: false },
      { id: "6", name: "Kurang Tata Krama", status: true },
      { id: "7", name: "Terlambat Datang", status: false },
      { id: "8", name: "Sulit Dihubungi", status: true },
      { id: "9", name: "Keamanan Data", status: true },
      { id: "10", name: "Kemudahan Akses", status: false },
    ];
    return _.shuffle(kriteria);
  },
};

export default fakers;
