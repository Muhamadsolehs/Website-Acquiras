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
    "Admin Menu",
    {
      icon: "GaugeCircle",
      pathname: "/",
      title: "Dashboard",
    },
    {
      icon: "Album",
      pathname: "/master-data",
      title: "Master Data",
      subMenu: [
        {
          icon: "LayoutPanelTop",
          pathname: "/master-data/master-akun",
          title: "Data Master Akun",
        },
        {
          icon: "LayoutPanelTop",
          pathname: "/master-data/master-vendor",
          title: "Data Master Vendor",
        },
      ],
    },
    {
      icon: "MonitorDot",
      pathname: "/monitoring-pengadaan",
      title: "Monitoring Pengadaan",
    },
    {
      icon: "FlameKindling",
      pathname: "/master-lelang",
      title: "Master Lelang",
    },
    {
      icon: "MonitorOff",
      pathname: "/daftar-hitam",
      title: "Daftar Hitam",
    },
    {
      icon: "MonitorCheck",
      pathname: "/monitoring-progress-pekerjaan",
      title: "Progress Pekerjaan",
    },
    {
      icon: "Settings2",
      pathname: "/pengaturan",
      title: "Pengaturan",
      subMenu: [
        {
          icon: "ShieldCheck",
          pathname: "/pengaturan/log",
          title: "Log Activity",
        },
        {
          icon: "ActivitySquare",
          pathname: "/pengaturan/other",
          title: "Other Settings",
        },
      ],
    },
    "Vendor Menu",
    {
      icon: "GaugeCircle",
      pathname: "/",
      title: "Beranda",
    },
    {
      icon: "Album",
      pathname: "/data-vendor",
      title: "Data Vendor",
    },
    {
      icon: "MonitorDot",
      pathname: "/monitoring-pengadaan",
      title: "Monitoring Pengadaan",
    },
    {
      icon: "FlameKindling",
      pathname: "/lelang",
      title: "Lelang",
      subMenu: [
        {
          icon: "FileText",
          pathname: "/lelang/daftar-lelang",
          title: "Daftar Lelang",
        },
        {
          icon: "FileText",
          pathname: "/lelang/masa-sanggah",
          title: "Masa Sanggah",
        },
        {
          icon: "FileText",
          pathname: "/lelang/pengumuman",
          title: "Pengumuman",
        },
        {
          icon: "FileText",
          pathname: "/lelang/penagihan",
          title: "Penagihan",
        },
      ],
    },
    {
      icon: "MonitorOff",
      pathname: "/daftar-hitam",
      title: "Daftar Hitam",
    },
    {
      icon: "MonitorCheck",
      pathname: "/monitoring-progress-pekerjaan",
      title: "Progress Pekerjaan",
    },
    {
      icon: "Settings2",
      pathname: "/pengaturan",
      title: "Pengaturan",
      subMenu: [
        {
          icon: "ShieldCheck",
          pathname: "/pengaturan/log",
          title: "Log Activity",
        },
        {
          icon: "ActivitySquare",
          pathname: "/pengaturan/other",
          title: "Other Settings",
        },
      ],
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
