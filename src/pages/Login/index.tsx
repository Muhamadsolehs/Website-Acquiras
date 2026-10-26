import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import Alert from "@/components/Base/Alert";
import Lucide from "@/components/Base/Lucide";
import clsx from "clsx";
import _, { set } from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { co } from "@fullcalendar/core/internal-common";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setTheme } from "@/stores/themeSlice";
import logo from "@/assets/images/logo/acquiras.png";
import api from "@/api/axiosinstance";


function Main() {
  const location = useLocation();
  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string | undefined }>({});
  const [showGeneralError, setShowGeneralError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({});

    try {
      const response = await api.post("/auth/login", {
        username: form.username,
        password: form.password,
      });

      const data = response.data;

      if (data && data.token) {
        localStorage.setItem("eproc_token", data.token);
        localStorage.setItem("eproc_user", JSON.stringify(data.user));
        localStorage.setItem(
          "eproc_user_role",
          data.user.role?.toString?.() || "",
        );
        toast.success("Login Berhasil!");
        const role = data.user.role?.toString?.() || "";
        setTimeout(() => {
          if (role === "1") {
            localStorage.setItem("theme", "echo");
            dispatch(setTheme("echo"));
            navigate("/dashboard");
          } else if (role === "2") {
            localStorage.setItem("theme", "echo-navbar");
            dispatch(setTheme("echo-navbar"));
            navigate("/dashboard");
          } else {
            localStorage.setItem("theme", "echo");
            dispatch(setTheme("echo"));
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err: any) {
      console.log(err);
      const apiErrors = err?.response?.data?.errors;
      const apiMessage = err?.response?.data?.message;
      if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
        const fieldErrors: { [key: string]: string } = {};
        apiErrors.forEach((e: any) => {
          fieldErrors[e.field] = e.message;
        });
        setError({ ...fieldErrors, general: undefined });
        if (apiMessage) toast.error(apiMessage);
      } else if (apiMessage) {
        setError({ general: apiMessage });
        setShowGeneralError(true);
        toast.error(apiMessage);
      } else {
        setError({ general: "Koneksi ke backend gagal. Pastikan backend Laravel berjalan di port 8000." });
        setShowGeneralError(true);
        toast.error("Gagal terhubung ke backend");
      }

      setForm((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showGeneralError) {
      setShowGeneralError(true);
      const timer = setTimeout(() => setShowGeneralError(false), 5000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <>
      <div className="container grid lg:h-screen overflow-y-hidden grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
        <div
          className={clsx([
            "relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0 dark:bg-darkmode-600",
            "before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5 dark:before:hidden",
          ])}
        >
          <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
            <Link to="/" className="inline-flex items-center gap-2.5 w-fit group">
              <div className="flex items-center justify-center w-[34px] rounded-lg h-[34px] border-theme-2 border overflow-hidden">
                <img
                  src={logo}
                  alt="Acquiras"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition">
                &larr; Kembali ke Beranda
              </span>
            </Link>
            <div className="mt-8">
              <div className="text-2xl font-medium">Sign In</div>
              <div className="mt-2.5 text-slate-600 dark:text-slate-400">
                Belum punya akun?{" "}
                <Link className="font-medium text-primary" to="/register">
                  Daftar disini
                </Link>
              </div>

              {localStorage.getItem("eproc_token") && (
                <div className="my-4 rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-primary">Sesi login aktif:</span>{" "}
                      <strong>
                        {(() => {
                          try {
                            const u = JSON.parse(localStorage.getItem("eproc_user") || "{}");
                            return u.first_name || u.username || "Pengguna";
                          } catch {
                            return "Pengguna";
                          }
                        })()}
                      </strong>{" "}
                      ({localStorage.getItem("eproc_user_role") === "1" ? "Administrator" : "Vendor"})
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="px-2.5 py-1 text-xs shrink-0"
                      onClick={() => navigate("/dashboard")}
                    >
                      Ke Dashboard
                    </Button>
                  </div>
                  <div className="mt-2 text-slate-500">
                    Ingin berganti akun? Masukkan kredensial baru di formulir bawah atau{" "}
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("eproc_token");
                        localStorage.removeItem("eproc_user");
                        localStorage.removeItem("eproc_user_role");
                        localStorage.removeItem("theme");
                        window.location.reload();
                      }}
                      className="text-danger underline font-medium hover:text-red-700"
                    >
                      keluar dari sesi ini
                    </button>.
                  </div>
                </div>
              )}

              {location?.state?.registered && (
                <Alert
                  variant="outline-success"
                  className="flex items-center px-4 py-3 my-7 bg-success/5 border-success/20 rounded-[0.6rem] leading-[1.7]"
                >
                  {({ dismiss }) => (
                    <>
                      <div className="">
                        <Lucide
                          icon="Lightbulb"
                          className="stroke-[0.8] w-7 h-7 mr-2 fill-success/10"
                        />
                      </div>
                      <div className="ml-1 mr-8">
                        <div className="font-medium">Yeaay Success!</div>
                        <div className="mt-1 text-slate-600 dark:text-slate-400">
                          {location?.state?.message}
                        </div>
                      </div>
                      <Alert.DismissButton
                        type="button"
                        className="btn-close text-success"
                        onClick={dismiss}
                        aria-label="Close"
                      >
                        <Lucide icon="X" className="w-5 h-5" />
                      </Alert.DismissButton>
                    </>
                  )}
                </Alert>
              )}

              <div className="mt-6">
                <FormLabel>
                  Username<span className="text-red-600">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={form.username}
                  className="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80"
                  placeholder="jhondoe"
                />

                <FormLabel className="mt-4">
                  Password<span className="text-red-600">*</span>
                </FormLabel>
                <FormInput
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  className="block px-4 py-3.5 rounded-[0.6rem] border-slate-300/80"
                  placeholder="************"
                />
                <div className="flex mt-4 text-xs text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto">
                    <FormCheck.Input
                      id="remember-me"
                      name="remember-me"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                      checked={form.rememberMe}
                      type="checkbox"
                      className="mr-2.5 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      Ingat Saya
                    </label>
                  </div>
                  <a href="/forgot-password">Lupa Password?</a>
                </div>

                {showGeneralError && error.general && (
                  <Alert
                    variant="outline-danger"
                    className="flex items-center px-4 py-3 my-7 bg-danger/5 border-danger/20 rounded-[0.6rem] leading-[1.7]"
                  >
                    {({ dismiss }) => (
                      <>
                        <div className="">
                          <Lucide
                            icon="Lightbulb"
                            className="stroke-[0.8] w-7 h-7 mr-2 fill-danger/10"
                          />
                        </div>
                        <div className="ml-1 mr-8">
                          <div className="font-medium">Terjadi Kesalahan!</div>
                          <div className="mt-1 text-slate-600 dark:text-slate-400">
                            {error.general}
                          </div>
                        </div>
                        <Alert.DismissButton
                          type="button"
                          className="btn-close text-danger"
                          onClick={dismiss}
                          aria-label="Close"
                        >
                          <Lucide icon="X" className="w-5 h-5" />
                        </Alert.DismissButton>
                      </>
                    )}
                  </Alert>
                )}

                <div className="mt-5 text-center xl:mt-8 xl:text-left">
                  <Button
                    onClick={handleLogin}
                    variant="primary"
                    rounded
                    disabled={loading}
                    className=" border-none w-full py-3.5 xl:mr-3 "
                  >
                    {loading ? "Memproses..." : "Sign In"}
                  </Button>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-darkmode-400">
                    <div className="text-xs text-slate-500 mb-2 font-medium">Pilihan Akun Demo:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ username: "admin", password: "password", rememberMe: true })}
                        className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-darkmode-400 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-darkmode-300 text-left transition"
                      >
                        <div className="font-semibold text-primary">Admin Pokja</div>
                        <div className="text-[10px] text-slate-500">admin / password</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ username: "vendor2", password: "password", rememberMe: true })}
                        className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-darkmode-400 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-darkmode-300 text-left transition"
                      >
                        <div className="font-semibold text-success">Vendor Penyedia</div>
                        <div className="text-[10px] text-slate-500">vendor2 / password</div>
                      </button>
                    </div>
                  </div>
                  {/* <Button
                    as={Link}
                    to="/register"
                    variant="outline-secondary"
                    rounded
                    className="bg-white/70 w-full py-3.5 mt-3 dark:bg-darkmode-400"
                  >
                    Sign Up
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
        <div
          className={clsx([
            "relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20",
            "after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:after:bg-darkmode-600 dark:after:from-darkmode-600 dark:after:to-darkmode-600",
            "before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0] dark:before:from-darkmode-300 dark:before:to-darkmode-300",
          ])}
        ></div>
        <div
          className={clsx([
            "h-full col-span-7 2xl:col-span-8 lg:relative",
            "before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-2 before:to-theme-1 before:w-screen before:lg:w-[800%]",
            "after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat",
          ])}
        >
          <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
            <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
              Acquiras <br /> Sistem E-Procurement <br /> (Digital Procurement
              Solution)
            </div>

            <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
              Acquiras adalah sistem e-procurement modern yang dirancang untuk
              membantu perusahaan mengelola proses pengadaan secara digital,
              transparan, dan efisien. Mulai dari pengajuan kebutuhan, seleksi
              vendor, proses tender, hingga monitoring kontrak — semua
              terintegrasi dalam satu platform. Dengan dashboard interaktif dan
              fitur yang komprehensif, Acquiras mendukung tata kelola pengadaan
              yang lebih akuntabel dan profesional.
            </div>
            {/* <div className="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
              <div className="flex items-center">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Name here"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Name here"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Name here"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                  <Tippy
                    as="img"
                    alt="Name here"
                    className="rounded-full border-[3px] border-white/50"
                    src={users.fakeUsers()[0].photo}
                    content={users.fakeUsers()[0].name}
                  />
                </div>
              </div> */}
            <div className="text-base xl:ml-2 2xl:ml-3 text-white/70">
              Lebih dari 7 ribu pengguna dan terus bertambah! Perjalanan Anda
              dimulai di sini.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
