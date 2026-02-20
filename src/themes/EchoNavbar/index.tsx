import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/echo.css";
import { useState, useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  type NavigateFunction,
} from "react-router-dom";
import { selectVendorMenu } from "@/stores/sideMenuSlice";
import { useAppSelector } from "@/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu } from "../Echo/side-menu";
import Lucide from "@/components/Base/Lucide";
import clsx from "clsx";
import { Menu } from "@/components/Base/Headless";
import QuickSearch from "@/components/QuickSearch";
import NotificationsPanel from "@/components/NotificationsPanel";
import logo from "@/assets/images/logo/acquiras.png";
import useLogout from "@/hooks/useLogout";
import profile from "@/assets/images/avatar/person_1.png";

function NavItem({
  menu,
  formattedMenu,
  setFormattedMenu,
  setMobileNavOpen,
  navigate,
}: {
  menu: FormattedMenu;
  formattedMenu: Array<FormattedMenu | string>;
  setFormattedMenu: (m: Array<FormattedMenu | string>) => void;
  setMobileNavOpen: (v: boolean) => void;
  navigate: NavigateFunction;
}) {
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    linkTo(menu, navigate);
    setFormattedMenu([...formattedMenu]);
    setMobileNavOpen(false);
  };
  const hasSub = menu.subMenu && menu.subMenu.length > 0;
  const subMenu = menu.subMenu ?? [];

  if (hasSub) {
    return (
      <div className="relative group/nav">
        <button
          type="button"
          onClick={handleNavClick}
          className={clsx(
            "flex w-full items-center gap-2 border-b border-slate-700/50 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-white/10 hover:text-slate-700 xl:border-b-2 xl:border-transparent xl:py-3.5 xl:px-4",
            menu.active && "xl:border-theme-2 xl:bg-white/10 xl:text-theme-2",
          )}
        >
          <Lucide icon={menu.icon} className="h-4 w-4 shrink-0" />
          <span>{menu.title}</span>
          <Lucide icon="ChevronDown" className="ml-auto h-4 w-4 xl:ml-1" />
        </button>
        {/* Desktop: dropdown hanya muncul saat hover, tidak stuck saat active */}
        <div
          className={clsx(
            "xl:absolute xl:left-0 xl:top-full xl:z-50 xl:min-w-[200px] xl:rounded-b-lg xl:border xl:border-t-0 xl:border-slate-200 xl:bg-white xl:shadow-lg dark:xl:border-darkmode-400 dark:xl:bg-darkmode-700",
            "xl:opacity-0 xl:invisible xl:pointer-events-none xl:transition-all group-hover/nav:xl:opacity-100 group-hover/nav:xl:visible group-hover/nav:xl:pointer-events-auto",
          )}
        >
          {subMenu.map((sub, subKey) => (
            <a
              key={subKey}
              href=""
              onClick={(e) => {
                e.preventDefault();
                if (sub.pathname) navigate(sub.pathname);
                setFormattedMenu([...formattedMenu]);
                setMobileNavOpen(false);
              }}
              className={clsx(
                "block border-b border-slate-700/50 px-4 py-2.5 text-sm text-slate-700 hover:bg-white/10 hover:text-slate-700 last:border-b-0 xl:border-b-0 xl:py-2 xl:px-4 xl:text-slate-700 xl:hover:bg-slate-100 dark:xl:text-slate-300 dark:xl:hover:bg-darkmode-600",
                sub.active
                  ? "xl:bg-theme-2/10 xl:text-theme-2 font-medium"
                  : "",
              )}
            >
              {sub.title}
            </a>
          ))}
        </div>
        {/* Mobile: expand/collapse pakai activeDropdown */}
        <div
          className={clsx(
            "xl:hidden",
            menu.activeDropdown ? "block" : "hidden",
          )}
        >
          {subMenu.map((sub, subKey) => (
            <a
              key={subKey}
              href=""
              onClick={(e) => {
                e.preventDefault();
                if (sub.pathname) navigate(sub.pathname);
                setMobileNavOpen(false);
              }}
              className={clsx(
                "block border-b border-slate-700/50 py-2.5 pl-12 pr-4 text-sm text-slate-700 hover:bg-white/10",
                sub.active ? "bg-white/10 font-medium text-theme-2" : "",
              )}
            >
              {sub.title}
            </a>
          ))}
        </div>
      </div>
    );
  }
  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        if (menu.pathname) navigate(menu.pathname);
        setFormattedMenu([...formattedMenu]);
        setMobileNavOpen(false);
      }}
      className={clsx(
        "flex items-center gap-2 border-b border-slate-700/50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white/10 hover:text-slate-700 xl:border-b-2 xl:border-transparent xl:py-3.5 xl:px-4",
        menu.active && "xl:border-theme-2 xl:bg-white/10 xl:text-theme-2",
      )}
    >
      <Lucide icon={menu.icon} className="h-4 w-4 shrink-0" />
      <span>{menu.title}</span>
    </a>
  );
}

function Main() {
  const handleLogout = async () => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";

      const token = localStorage.getItem("eproc_token");

      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("eproc_token");
      localStorage.removeItem("eproc_user");
      localStorage.removeItem("eproc_user_role");
      localStorage.removeItem("theme");

      navigate("/login");
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [topBarActive, setTopBarActive] = useState(false);
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | string>
  >([]);
  const vendorMenuStore = useAppSelector(selectVendorMenu);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState(false);
  const [notificationsPanel, setNotificationsPanel] = useState(false);

  const vendorMenu = () => nestedMenu(vendorMenuStore, location);

  useEffect(() => {
    setFormattedMenu(vendorMenu());
  }, [vendorMenuStore, location]);

  return (
    <div
      className={clsx([
        "echo group bg-gradient-to-b from-slate-200/70 to-slate-50 background relative min-h-screen dark:from-darkmode-800/[.95] dark:to-darkmode-900/[.95]",
        "before:content-[''] before:h-[370px] before:w-screen before:bg-gradient-to-t before:from-theme-1/80 before:to-theme-2 [&.background--hidden]:before:opacity-0 before:transition-[opacity,height] before:ease-in-out before:duration-300 before:top-0 before:fixed",
        "after:content-[''] after:h-[370px] after:w-screen [&.background--hidden]:after:opacity-0 after:transition-[opacity,height] after:ease-in-out after:duration-300 after:top-0 after:fixed after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-13rem] after:bg-no-repeat",
        topBarActive && "background--hidden",
      ])}
    >
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-theme-2 dark:bg-darkmode-800 shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 xl:px-6">
          <a
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-theme-2 bg-white">
              <img
                src={logo}
                alt="Acquiras"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-semibold text-white">ACQUIRAS</span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href=""
              className="p-2 text-white rounded-full hover:bg-white/5"
              onClick={(e) => {
                e.preventDefault();
                setQuickSearch(true);
              }}
            >
              <Lucide icon="Search" className="w-[18px] h-[18px]" />
            </a>
            <button
              type="button"
              onClick={() => setNotificationsPanel(true)}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Notifikasi"
            >
              <Lucide icon="Bell" className="h-5 w-5" />
            </button>
            <Menu className="relative">
              <Menu.Button className="overflow-hidden rounded-full h-9 w-9 border-2 border-white/20">
                <img
                  src={profile}
                  alt="Profil"
                  className="h-full w-full object-cover"
                />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-darkmode-400 dark:bg-darkmode-700">
                <Menu.Item
                  onClick={() => navigate("/profile")}
                  className="flex cursor-pointer items-center px-4 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-darkmode-600"
                >
                  <Lucide icon="Users" className="mr-2 h-4 w-4" />
                  Profil
                </Menu.Item>
                <Menu.Item
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center px-4 py-2 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-darkmode-600"
                >
                  <Lucide icon="Power" className="mr-2 h-4 w-4" />
                  Keluar
                </Menu.Item>
              </Menu.Items>
            </Menu>
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white xl:hidden"
              aria-label="Menu"
            >
              <Lucide
                icon={mobileNavOpen ? "X" : "AlignJustify"}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>

        <nav
          className={clsx(
            "border-t border-slate-700/50 bg-slate-100/95 backdrop-blur dark:border-darkmode-600",
            "xl:block",
            mobileNavOpen ? "block" : "hidden",
          )}
        >
          <div className="flex flex-col xl:flex-row xl:items-center xl:gap-0">
            {formattedMenu.map((menu, menuKey) =>
              typeof menu === "string" ? null : (
                <NavItem
                  key={menuKey}
                  menu={menu}
                  formattedMenu={formattedMenu}
                  setFormattedMenu={setFormattedMenu}
                  setMobileNavOpen={setMobileNavOpen}
                  navigate={navigate}
                />
              ),
            )}
          </div>
        </nav>
      </header>

      <main className="relative z-10 px-4 py-6 xl:px-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>

      <QuickSearch quickSearch={quickSearch} setQuickSearch={setQuickSearch} />
      <NotificationsPanel
        notificationsPanel={notificationsPanel}
        setNotificationsPanel={setNotificationsPanel}
      />
    </div>
  );
}

export default Main;
