import { useRoutes } from "react-router-dom";


import Dashboard from "../pages/Dashboard";
import MasterPermohonan from "../pages/MasterPermohonan";
import AddMasterPermohonan from "../pages/MasterPermohonan/add";
import EditMasterPermohonan from "../pages/MasterPermohonan/edit";
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
import Profile from "../pages/Settings";


import Layout from "../themes";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/master-permohonan",
          element: <MasterPermohonan />,
        },
        {
          path: "/master-permohonan/add",
          element: <AddMasterPermohonan />,
        },
        {
          path: "/master-permohonan/edit/:id",
          element: <EditMasterPermohonan />,
        },
        {
          path: "/pemohon",
          element: <Pemohon />,
        },
        {
          path: "/pemohon/add",
          element: <AddPemohon />,
        },
        {
          path: "/pemohon/edit/:id",
          element: <EditPemohon />,
        },
        {
          path: "/ahli",
          element: <Ahli />,
        },
        {
          path: "/ahli/add",
          element: <AddAhli />,
        },
        {
          path: "/ahli/edit/:id",
          element: <EditAhli />,
        },
        {
          path: "/penilaian",
          element: <Penilaian />,
        },
        {
          path: "/penilaian/add",
          element: <AddPenilaian />,
        },
        {
          path: "/penilaian/edit/:id",
          element: <EditPenilaian />,
        },
        {
          path: "/penilaian/setting",
          element: <SettingPenilaian />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
