import { useRoutes } from "react-router-dom";

import Dashboard from "../pages/Dashboard";

import Akun from "../pages/MasterData/Akun";
import AddAkun from "../pages/MasterPermohonan/add";
import EditAkun from "../pages/MasterPermohonan/edit";

import Vendor from "../pages/MasterData/Vendor";
import DataVendor from "../pages/DataVendor";
import AddLelang from "../pages/Lelang/addlelang";
import EditLelang from "../pages/Lelang/editlelang";
import ShowDetailLelang from "../pages/Lelang/show_detail";
import ShowLelangVendor from "../pages/Lelang/show_detail_vendor";

import MonitoringPengadaan from "../pages/MonitoringPengadaan";
import ProgressPekerjaan from "../pages/ProgressPekerjaan";
import Lelang from "../pages/Lelang";
import DaftarLelang from "../pages/Lelang/vendor";
import MasaSanggah from "../pages/Lelang/masa_sanggah";
import MasaSanggahAction from "../pages/Lelang/masa_sanggah_action";
import Pengumuman from "../pages/Lelang/pengumuman";
import Penagihan from "../pages/Lelang/penagihan";
import PenagihanAction from "../pages/Lelang/penagihan_action";
import DaftarHitam from "../pages/DaftarHItam";

import Pemohon from "../pages/Pemohon";
import AddPemohon from "../pages/Pemohon/add";
import EditPemohon from "../pages/Pemohon/edit";
import Ahli from "../pages/Ahli";
import AddAhli from "../pages/Ahli/add";
import EditAhli from "../pages/Ahli/edit";
import Penilaian from "../pages/Penilaian";
import AddPenilaian from "../pages/Penilaian/add";
import EditPenilaian from "../pages/Penilaian/edit";
import SettingPenilaian from "../pages/Penilaian/setting";
import Profile from "../pages/Profile";
import Pengaturan from "../pages/Pengaturan";
import Log from "../pages/Pengaturan/log-activity";

import Layout from "../themes";
import GuestLayout from "../themes/GuestLayout";
import GuestBeranda from "../pages/Guest/Beranda";
import GuestDaftarLelang from "../pages/Guest/DaftarLelang";
import GuestDaftarHitam from "../pages/Guest/DaftarHitam";
import GuestMonitoringPengadaan from "../pages/Guest/MonitoringPengadaan";
import path from "path";
import Login from "../pages/Login";
import GuestRoute from "./guestRoute";
import ProtectedRoute from "./protectedRoute";

function Router() {
  const routes = [
    {
      path: "/",
      element: <GuestLayout />,
      children: [
        { path: "", element: <GuestBeranda /> },
        { path: "daftar-lelang", element: <GuestDaftarLelang /> },
        { path: "daftar-hitam", element: <GuestDaftarHitam /> },
        { path: "monitoring-pengadaan", element: <GuestMonitoringPengadaan /> },
      ],
    },
    {
      path: "/login",
      element: (
        <GuestRoute>
          <Login />
        </GuestRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      // element: (
      //   <ProtectedRoute>
      //     <Layout />
      //   </ProtectedRoute>
      // ),
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "master-data/master-akun",
          element: <Akun />,
        },
        // {
        //   path: "/master-permohonan/add",
        //   element: <AddMasterPermohonan />,
        // },
        // {
        //   path: "/master-permohonan/edit/:id",
        //   element: <EditMasterPermohonan />,
        // },
        {
          path: "master-data/master-vendor",
          element: <Vendor />,
        },
        {
          path: "data-vendor",
          element: <DataVendor />,
        },
        {
          path: "master-lelang/add",
          element: <AddLelang />,
        },
        {
          path: "master-lelang/edit/:id",
          element: <EditLelang />,
        },
        {
          path: "master-lelang/:id",
          element: <ShowDetailLelang />,
        },
        {
          path: "lelang/show/:id",
          element: <ShowLelangVendor />,
        },
        {
          path: "lelang/masa-sanggah/:id",
          element: <MasaSanggahAction />,
        },
        {
          path: "master-lelang/show/:id",
          element: <ShowDetailLelang />,
        },
        {
          path: "pemohon/add",
          element: <AddPemohon />,
        },
        // {
        //   path: "pemohon/edit/:id",
        //   element: <EditPemohon />,
        // },
        {
          path: "monitoring-pengadaan",
          element: <MonitoringPengadaan />,
        },
        {
          path: "daftar-hitam",
          element: <DaftarHitam />,
        },
        {
          path: "monitoring-progress-pekerjaan",
          element: <ProgressPekerjaan />,
        },
        {
          path: "ahli/add",
          element: <AddAhli />,
        },
        {
          path: "ahli/edit/:id",
          element: <EditAhli />,
        },
        {
          path: "master-lelang",
          element: <Lelang />,
        },
        {
          path: "lelang/daftar-lelang",
          element: <DaftarLelang />,
        },
        {
          path: "lelang/masa-sanggah",
          element: <MasaSanggah />,
        },
        {
          path: "lelang/masa-sanggah/:id",
          element: <MasaSanggahAction />,
        },
        {
          path: "lelang/penagihan/:id",
          element: <PenagihanAction />,
        },
        {
          path: "lelang/pengumuman",
          element: <Pengumuman />,
        },
        {
          path: "lelang/penagihan",
          element: <Penagihan />,
        },
        {
          path: "penilaian/add",
          element: <AddPenilaian />,
        },
        {
          path: "penilaian/edit/:id",
          element: <EditPenilaian />,
        },
        {
          path: "penilaian/setting",
          element: <SettingPenilaian />,
        },
        {
          path: "pengaturan/other",
          element: <Pengaturan />,
        },
        {
          path: "pengaturan/log",
          element: <Log />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
