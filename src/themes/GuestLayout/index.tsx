import "@/assets/css/themes/echo.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo/acquiras.png";
import clsx from "clsx";

function Main() {
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="echo min-h-screen bg-gradient-to-b from-slate-200/70 to-slate-50 dark:from-darkmode-800/[.95] dark:to-darkmode-900/[.95]">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-theme-2 dark:bg-darkmode-800 shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 xl:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/30 bg-white">
              <img src={logo} alt="Acquiras" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold text-white">ACQUIRAS</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1">
            <Link
              to="/"
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/") && location.pathname === "/"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/10"
              )}
            >
              Beranda
            </Link>
            <Link
              to="/daftar-lelang"
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/daftar-lelang")
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/10"
              )}
            >
              Daftar Lelang
            </Link>
            <Link
              to="/daftar-hitam"
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/daftar-hitam")
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/10"
              )}
            >
              Daftar Hitam
            </Link>
            <Link
              to="/monitoring-pengadaan"
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/monitoring-pengadaan")
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/10"
              )}
            >
              Monitoring Pengadaan
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-white px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Pendaftaran Penyedia
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-theme-1 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 xl:px-6">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Main;
