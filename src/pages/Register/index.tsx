import { FormCheck, FormInput, FormLabel, FormSelect, FormTextarea } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Alert from "@/components/Base/Alert";
import Lucide from "@/components/Base/Lucide";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/api/axiosinstance";
import logo from "@/assets/images/logo/acquiras.png";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string | undefined }>({});

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    nama_perusahaan: "",
    bentuk_usaha: "PT",
    npwp: "",
    no_telepon: "",
    alamat: "",
    provinsi: "DKI Jakarta",
    kabupaten_kota: "Jakarta Pusat",
    kualifikasi: "Kecil",
    agree: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    // Client-side validations
    if (!form.username || !form.email || !form.password || !form.nama_perusahaan || !form.npwp || !form.no_telepon || !form.alamat) {
      toast.error("Mohon lengkapi semua kolom bertanda bintang (*)");
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError({ password_confirmation: "Konfirmasi password tidak cocok" });
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    if (!form.agree) {
      toast.error("Anda harus menyetujui syarat & ketentuan");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        nama_perusahaan: form.nama_perusahaan,
        bentuk_usaha: form.bentuk_usaha,
        npwp: form.npwp,
        no_telepon: form.no_telepon,
        alamat: form.alamat,
        provinsi: form.provinsi,
        kabupaten_kota: form.kabupaten_kota,
        kualifikasi: form.kualifikasi,
      });

      if (response.data && (response.status === 200 || response.status === 201)) {
        toast.success("Pendaftaran Berhasil! Silakan masuk dengan akun Anda.");
        navigate("/login", {
          state: {
            registered: true,
            message: `Akun vendor ${form.nama_perusahaan} berhasil didaftarkan. Silakan login.`,
          },
        });
      }
    } catch (err: any) {
      console.error("Register error:", err);
      const apiMessage = err?.response?.data?.message;
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: { [key: string]: string } = {};
        Object.keys(apiErrors).forEach((key) => {
          fieldErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setError(fieldErrors);
        toast.error("Harap periksa isian formulir");
      } else if (apiMessage) {
        setError({ general: apiMessage });
        toast.error(apiMessage);
      } else {
        setError({ general: "Terjadi kesalahan saat registrasi. Pastikan backend aktif." });
        toast.error("Terjadi kesalahan saat registrasi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkmode-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header & Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 p-2 mb-4">
            <img src={logo} alt="Acquiras" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Pendaftaran Vendor Baru
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg">
            Bergabunglah dengan ekosistem pengadaan digital <strong>ACQUIRAS E-PROC</strong>. 
            Lengkapi data profil perusahaan untuk memulai proses tender.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-darkmode-600 rounded-2xl shadow-xl border border-slate-200/80 dark:border-darkmode-400 p-6 sm:p-10">
          {error.general && (
            <Alert variant="outline-danger" className="mb-6 flex items-center">
              <Lucide icon="AlertCircle" className="w-5 h-5 mr-3 text-danger" />
              <span>{error.general}</span>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            {/* Bagian 1: Akun Login */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-darkmode-400 text-lg font-semibold text-primary">
                <Lucide icon="UserCheck" className="w-5 h-5" />
                <span>1. Informasi Akun Pengguna</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <FormLabel>
                    Username<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="contoh: vendor_jaya"
                    className={clsx({ "border-danger": error.username })}
                    required
                  />
                  {error.username && <p className="text-xs text-danger mt-1">{error.username}</p>}
                </div>
                <div>
                  <FormLabel>
                    Email Akun<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@perusahaan.com"
                    className={clsx({ "border-danger": error.email })}
                    required
                  />
                  {error.email && <p className="text-xs text-danger mt-1">{error.email}</p>}
                </div>
                <div>
                  <FormLabel>
                    Password<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className={clsx({ "border-danger": error.password })}
                    required
                  />
                  {error.password && <p className="text-xs text-danger mt-1">{error.password}</p>}
                </div>
                <div>
                  <FormLabel>
                    Konfirmasi Password<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    className={clsx({ "border-danger": error.password_confirmation })}
                    required
                  />
                  {error.password_confirmation && (
                    <p className="text-xs text-danger mt-1">{error.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 2: Profil Badan Usaha / Perusahaan */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-darkmode-400 text-lg font-semibold text-primary">
                <Lucide icon="Building2" className="w-5 h-5" />
                <span>2. Identitas Perusahaan / Vendor</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <FormLabel>
                    Nama Perusahaan<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="nama_perusahaan"
                    value={form.nama_perusahaan}
                    onChange={handleChange}
                    placeholder="PT / CV Nama Perusahaan"
                    className={clsx({ "border-danger": error.nama_perusahaan })}
                    required
                  />
                  {error.nama_perusahaan && (
                    <p className="text-xs text-danger mt-1">{error.nama_perusahaan}</p>
                  )}
                </div>
                <div>
                  <FormLabel>
                    Bentuk Usaha<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormSelect
                    name="bentuk_usaha"
                    value={form.bentuk_usaha}
                    onChange={handleChange}
                  >
                    <option value="PT">PT (Perseroan Terbatas)</option>
                    <option value="CV">CV (Commanditaire Vennootschap)</option>
                    <option value="Koperasi">Koperasi</option>
                    <option value="Firma">Firma</option>
                    <option value="Perorangan">Perorangan / Usaha Dagang (UD)</option>
                  </FormSelect>
                </div>

                <div>
                  <FormLabel>
                    NPWP Perusahaan<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="npwp"
                    value={form.npwp}
                    onChange={handleChange}
                    placeholder="00.000.000.0-000.000"
                    className={clsx({ "border-danger": error.npwp })}
                    required
                  />
                  {error.npwp && <p className="text-xs text-danger mt-1">{error.npwp}</p>}
                </div>

                <div>
                  <FormLabel>
                    No. Telepon / WhatsApp<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="no_telepon"
                    value={form.no_telepon}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className={clsx({ "border-danger": error.no_telepon })}
                    required
                  />
                  {error.no_telepon && (
                    <p className="text-xs text-danger mt-1">{error.no_telepon}</p>
                  )}
                </div>

                <div>
                  <FormLabel>Provinsi</FormLabel>
                  <FormInput
                    type="text"
                    name="provinsi"
                    value={form.provinsi}
                    onChange={handleChange}
                    placeholder="Jawa Barat, DKI Jakarta, dll"
                  />
                </div>

                <div>
                  <FormLabel>Kabupaten / Kota</FormLabel>
                  <FormInput
                    type="text"
                    name="kabupaten_kota"
                    value={form.kabupaten_kota}
                    onChange={handleChange}
                    placeholder="Bandung, Jakarta Pusat, dll"
                  />
                </div>

                <div>
                  <FormLabel>Kualifikasi Usaha</FormLabel>
                  <FormSelect
                    name="kualifikasi"
                    value={form.kualifikasi}
                    onChange={handleChange}
                  >
                    <option value="Kecil">Kecil (Modal &lt; Rp 5 Milyar)</option>
                    <option value="Menengah">Menengah (Modal Rp 5M - Rp 10M)</option>
                    <option value="Besar">Besar (Modal &gt; Rp 10 Milyar)</option>
                  </FormSelect>
                </div>

                <div className="sm:col-span-2">
                  <FormLabel>
                    Alamat Lengkap Perusahaan<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormTextarea
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Jalan, No. Gedung, RT/RW, Kelurahan, Kecamatan"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Persetujuan */}
            <div className="flex items-start gap-2 pt-2">
              <FormCheck.Input
                type="checkbox"
                id="agree"
                name="agree"
                checked={form.agree}
                onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))}
                className="mt-1"
              />
              <label htmlFor="agree" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">
                Saya menyatakan bahwa data yang diisi adalah benar dan sah. Saya bersedia mematuhi seluruh 
                ketentuan dan regulasi pengadaan barang dan jasa pada sistem <strong>ACQUIRAS E-PROC</strong>.
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-darkmode-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Sudah memiliki akun?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Masuk di sini
                </Link>
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Lucide icon="Loader2" className="w-4 h-4 animate-spin" />
                    Memproses Pendaftaran...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lucide icon="Check" className="w-4 h-4" />
                    Daftar Sebagai Vendor
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
