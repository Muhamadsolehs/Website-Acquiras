import _ from "lodash";

export interface User {
  id: number;
  userid: string;
  email: string;
  type: string;
  cabang: boolean;
  npwpid: number;
  password: string;
  datejoined: Date;
}

const fakers = {
  fakeUsers() {
    const users: Array<User> = [
      {
        id: 1,
        userid: "tomhanks",
        email: "tom.hanks@left4code.com",
        type: "BUMN",
        cabang: true,
        npwpid: 1234567890,
        password: "password123",
        datejoined: new Date("2010-01-15"),
      },
      {
        id: 2,
        userid: "merylstreep",
        email: "meryl.streep@left4code.com",
        type: "Persekutuan Komanditer (CV / Commanditer Venoschaap )",
        cabang: false,
        npwpid: 2345678901,
        password: "password456",
        datejoined: new Date("2015-03-22"),
      },
      {
        id: 3,
        userid: "leonardodicaprio",
        email: "leonardo.dicaprio@left4code.com",
        type: "Persekutuan Komanditer (CV / Commanditer Venoschaap )",
        cabang: false,
        npwpid: 3456789012,
        password: "password789",
        datejoined: new Date("2018-05-05"),
      },
    ];

    return _.shuffle(users);
  },
};

export default fakers;
