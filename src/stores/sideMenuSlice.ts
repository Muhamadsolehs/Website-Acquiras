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

const adminMenu: Array<Menu | string> = [
  {
    icon: "GaugeCircle",
    pathname: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: "Album",
    pathname: "/dashboard/master-data",
    title: "Master Data",
    subMenu: [
      {
        icon: "LayoutPanelTop",
        pathname: "/dashboard/master-data/master-akun",
        title: "Data Master Akun",
      },
      {
        icon: "LayoutPanelTop",
        pathname: "/dashboard/master-data/master-vendor",
        title: "Data Master Vendor",
      },
    ],
  },
  {
    icon: "MonitorDot",
    pathname: "/dashboard/monitoring-pengadaan",
    title: "Monitoring Pengadaan",
  },
  {
    icon: "FlameKindling",
    pathname: "/dashboard/master-lelang",
    title: "Master Lelang",
  },
  {
    icon: "MonitorOff",
    pathname: "/dashboard/daftar-hitam",
    title: "Daftar Hitam",
  },
  {
    icon: "MonitorCheck",
    pathname: "/dashboard/monitoring-progress-pekerjaan",
    title: "Progress Pekerjaan",
  },
  {
    icon: "Settings2",
    pathname: "/dashboard/pengaturan",
    title: "Pengaturan",
    subMenu: [
      {
        icon: "ShieldCheck",
        pathname: "/dashboard/pengaturan/log",
        title: "Log Activity",
      },
      {
        icon: "ActivitySquare",
        pathname: "/dashboard/pengaturan/other",
        title: "Other Settings",
      },
    ],
  },
];

const vendorMenu: Array<Menu | string> = [
  {
    icon: "GaugeCircle",
    pathname: "/dashboard",
    title: "Beranda",
  },
  {
    icon: "Album",
    pathname: "/dashboard/data-vendor",
    title: "Data Vendor",
  },
  {
    icon: "MonitorDot",
    pathname: "/dashboard/monitoring-pengadaan",
    title: "Monitoring Pengadaan",
  },
  {
    icon: "FlameKindling",
    pathname: "/dashboard/lelang",
    title: "Lelang",
    subMenu: [
      {
        icon: "FileText",
        pathname: "/dashboard/lelang/daftar-lelang",
        title: "Daftar Lelang",
      },
      {
        icon: "FileText",
        pathname: "/dashboard/lelang/masa-sanggah",
        title: "Masa Sanggah",
      },
      {
        icon: "FileText",
        pathname: "/dashboard/lelang/pengumuman",
        title: "Pengumuman",
      },
      {
        icon: "FileText",
        pathname: "/dashboard/lelang/penagihan",
        title: "Penagihan",
      },
    ],
  },
  {
    icon: "MonitorOff",
    pathname: "/dashboard/daftar-hitam",
    title: "Daftar Hitam",
  },
  {
    icon: "MonitorCheck",
    pathname: "/dashboard/monitoring-progress-pekerjaan",
    title: "Progress Pekerjaan",
  },
  {
    icon: "Settings2",
    pathname: "/dashboard/pengaturan",
    title: "Pengaturan",
    subMenu: [
      {
        icon: "ShieldCheck",
        pathname: "/dashboard/pengaturan/log",
        title: "Log Activity",
      },
      {
        icon: "ActivitySquare",
        pathname: "/dashboard/pengaturan/other",
        title: "Other Settings",
      },
    ],
  },
];

const initialState: SideMenuState = {
  menu: adminMenu,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});


export const selectSideMenu = (state: RootState): Array<Menu | string> => state.sideMenu.menu;

export const selectVendorMenu = (state: RootState): Array<Menu | string> => vendorMenu;


// export const selectVendorMenu = (state: RootState): Array<Menu | string> => {
//   const menu = state.sideMenu.menu;
//   const idx = menu.indexOf("Vendor Menu");
//   if (idx === -1) return [];
//   return menu.slice(idx + 1);
// };

export default sideMenuSlice.reducer;
