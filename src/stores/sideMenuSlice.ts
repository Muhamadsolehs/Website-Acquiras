import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | string>;
}

const initialState: SideMenuState = {
  menu: [
    "APPS",
    {
      icon: "GaugeCircle",
      pathname: "/",
      title: "Dashboard",
    },
    {
      icon: "Album",
      pathname: "/master-permohonan",
      title: "Master Permohonan",
    },
    {
      icon: "BookMarked",
      pathname: "/pemohon/master-data",
      title: "Master Data",
      subMenu: [
        {
          icon: "LayoutPanelTop",
          pathname: "/pemohon",
          title: "Data Pemohon",
        },
        {
          icon: "LayoutPanelLeft",
          pathname: "/ahli",
          title: "Data Ahli",
        },
      ],
    },
    {
      icon: "Settings2",
      pathname: "/penilaian",
      title: "Setting Penilaian",
    },


  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
