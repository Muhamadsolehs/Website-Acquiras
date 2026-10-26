import "@/assets/css/themes/echo.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo/acquiras.png";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Lucide from "@/components/Base/Lucide";
import { toast } from "sonner";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("eproc_token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const u = JSON.parse(localStorage.getItem("eproc_user") || "null");
        setCurrentUser(u);
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("eproc_token");
    localStorage.removeItem("eproc_user");
    localStorage.removeItem("eproc_user_role");
    localStorage.removeItem("theme");
    setIsLoggedIn(false);
    setCurrentUser(null);
    toast.success("Berhasil keluar dari akun.");
    navigate("/");
  };

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
            <span className="font-semibold text-white tracking-wide">ACQUIRAS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap items-center justify-end gap-1.5">
            <Link
              to="/"
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/") && location.pathname === "/"
                  ? "bg-white/20 text-white font-semibold"
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
                  ? "bg-white/20 text-white font-semibold"
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
                  ? "bg-white/20 text-white font-semibold"
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
                  ? "bg-white/20 text-white font-semibold"
                  : "text-white hover:bg-white/10"
              )}
            >
              Monitoring Pengadaan
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <Lucide icon="LayoutDashboard" className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/40 px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 transition"
                  title="Keluar dari akun"
                >
                  <Lucide icon="LogOut" className="h-3.5 w-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to="/register"
                  className="rounded-lg border border-white px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Pendaftaran Penyedia
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg bg-theme-1 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95 transition"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            aria-label="Menu"
          >
            <Lucide icon={mobileMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/15 bg-theme-2 px-4 py-3 space-y-1 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/") && location.pathname === "/" ? "bg-white/20 text-white font-semibold" : "text-white hover:bg-white/10"
              )}
            >
              Beranda
            </Link>
            <Link
              to="/daftar-lelang"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/daftar-lelang") ? "bg-white/20 text-white font-semibold" : "text-white hover:bg-white/10"
              )}
            >
              Daftar Lelang
            </Link>
            <Link
              to="/daftar-hitam"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/daftar-hitam") ? "bg-white/20 text-white font-semibold" : "text-white hover:bg-white/10"
              )}
            >
              Daftar Hitam
            </Link>
            <Link
              to="/monitoring-pengadaan"
              onClick={() => setMobileMenuOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive("/monitoring-pengadaan") ? "bg-white/20 text-white font-semibold" : "text-white hover:bg-white/10"
              )}
            >
              Monitoring Pengadaan
            </Link>

            <div className="pt-2 border-t border-white/20">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Lucide icon="LayoutDashboard" className="h-4 w-4" />
                    <span>Masuk ke Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-white/40 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition"
                  >
                    <Lucide icon="LogOut" className="h-3.5 w-3.5" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-lg border border-white px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                  >
                    Pendaftaran Penyedia
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-lg bg-theme-1 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95 transition"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
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

