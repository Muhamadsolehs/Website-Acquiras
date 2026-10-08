import Lucide from "@/components/Base/Lucide";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FormCheck,
    FormInput,
    FormHelp,
    FormSelect,
    FormTextarea,
} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import { Dialog } from "@/components/Base/Headless";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import api from "@/api/axiosinstance";
import { toast } from "sonner";
import defaultAvatar from "@/assets/images/avatar/person_1.png";

function Main() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = queryParams.get("page") || "profile";
    const [activeTab, setActiveTab] = useState(initialPage);

    // Profile State
    const [profileImage, setProfileImage] = useState<string>(defaultAvatar);
    const [savingProfile, setSavingProfile] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        role_name: "",
    });

    // Cek apakah akun bertipe Vendor
    const isVendor =
        currentUser?.role === "2" ||
        currentUser?.role_id === 2 ||
        currentUser?.role_name?.toLowerCase() === "vendor" ||
        !!currentUser?.vendor ||
        localStorage.getItem("eproc_user_role") === "2";

    // State Profil Perusahaan (Khusus Vendor)
    const [vendorForm, setVendorForm] = useState({
        id: null as number | null,
        id_vendor_code: "",
        nama_perusahaan: "",
        bentuk_usaha: "PT",
        status_cabang: 0,
        npwp: "",
        kswp_valid: 1,
        kualifikasi: "Kecil",
        alamat: "",
        kode_pos: "",
        provinsi: "",
        kabupaten_kota: "",
        no_telepon: "",
        no_fax: "",
        website: "",
        email_perusahaan: "",
    });
    const [savingVendor, setSavingVendor] = useState(false);

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [savingPassword, setSavingPassword] = useState(false);

    // 2FA State
    const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
        return localStorage.getItem("eproc_2fa") === "true";
    });
    const [twoFactorPassword, setTwoFactorPassword] = useState("");
    const [saving2FA, setSaving2FA] = useState(false);

    // Account Deactivation State
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    // Sinkronisasi Tab dengan URL
    useEffect(() => {
        const page = queryParams.get("page") || "profile";
        setActiveTab(page);
    }, [location.search]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const search = tab === "profile" ? "" : `?page=${tab}`;
        navigate(`${location.pathname}${search}`, { replace: true });
    };

    // Muat data user & vendor
    const loadUserData = async () => {
        setLoadingData(true);
        try {
            // Ambil dari API /auth/me
            const res = await api.get("/auth/me");
            const data = res.data;
            setCurrentUser(data);
            setForm({
                firstName: data.first_name || "",
                lastName: data.last_name || "",
                email: data.email || "",
                username: data.username || "",
                role_name: data.role_name || (data.role === "1" ? "Admin" : "Vendor"),
            });
            if (data.photo) {
                setProfileImage(data.photo);
            }

            // Ambil data vendor jika ada
            let vData = data.vendor;
            if (!vData && (data.role === "2" || data.role_id === 2 || data.role_name === "Vendor" || localStorage.getItem("eproc_user_role") === "2")) {
                try {
                    const vRes = await api.get("/vendors/me/profile");
                    if (vRes.data) {
                        vData = vRes.data;
                    }
                } catch (e) {}
            }
            if (vData) {
                setVendorForm({
                    id: vData.id,
                    id_vendor_code: vData.id_vendor_code || "",
                    nama_perusahaan: vData.nama_perusahaan || "",
                    bentuk_usaha: vData.bentuk_usaha || "PT",
                    status_cabang: vData.status_cabang ? 1 : 0,
                    npwp: vData.npwp || "",
                    kswp_valid: vData.kswp_valid ?? 1,
                    kualifikasi: vData.kualifikasi || "Kecil",
                    alamat: vData.alamat || "",
                    kode_pos: vData.kode_pos || "",
                    provinsi: vData.provinsi || "",
                    kabupaten_kota: vData.kabupaten_kota || "",
                    no_telepon: vData.no_telepon || "",
                    no_fax: vData.no_fax || "",
                    website: vData.website || "",
                    email_perusahaan: vData.email_perusahaan || "",
                });
            }

            // Simpan sinkronisasi ke eproc_user
            localStorage.setItem("eproc_user", JSON.stringify(data));
        } catch (err) {
            // Fallback ke localStorage
            const userStr = localStorage.getItem("eproc_user") || localStorage.getItem("user");
            if (userStr) {
                try {
                    const data = JSON.parse(userStr);
                    setCurrentUser(data);
                    setForm({
                        firstName: data.first_name || "",
                        lastName: data.last_name || "",
                        email: data.email || "",
                        username: data.username || "",
                        role_name: data.role_name || (data.role === "1" ? "Admin" : "Vendor"),
                    });
                    if (data.photo) {
                        setProfileImage(data.photo);
                    }
                    if (data.vendor) {
                        setVendorForm((prev) => ({
                            ...prev,
                            ...data.vendor,
                        }));
                    }
                } catch (e) {}
            }
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // Ganti input profil user
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Ganti input profil vendor
    const handleVendorChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setVendorForm((prev) => ({
            ...prev,
            [name]: name === "status_cabang" ? Number(value) : value,
        }));
    };

    // Submit simpan profil vendor
    const handleSaveVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorForm.id) {
            toast.error("ID Vendor tidak ditemukan.");
            return;
        }

        setSavingVendor(true);
        try {
            await api.put(`/vendors/${vendorForm.id}`, vendorForm);
            toast.success("Berhasil!", {
                description: "Profil perusahaan vendor berhasil diperbarui.",
                icon: <Lucide icon="CheckCircle2" className="w-5 h-5 text-success" />,
            });
            loadUserData();
        } catch (err: any) {
            console.error("Gagal simpan profil vendor:", err);
            toast.error("Gagal!", {
                description: err.response?.data?.message || "Data perusahaan gagal diperbarui.",
                icon: <Lucide icon="AlertTriangle" className="w-5 h-5 text-danger" />,
            });
        } finally {
            setSavingVendor(false);
        }
    };

    // Upload & ganti foto profil
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran foto maksimal 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setProfileImage(base64);
                toast.info("Foto profil dipilih. Klik 'Simpan' untuk menyimpan perubahan.");
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit simpan profil
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);

        try {
            const res = await api.put("/auth/profile", {
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                photo: profileImage,
            });

            if (res.data?.user) {
                localStorage.setItem("eproc_user", JSON.stringify(res.data.user));
            }

            toast.success("Berhasil!", {
                description: "Informasi profil Anda telah berhasil diperbarui.",
                icon: <Lucide icon="CheckCircle2" className="w-5 h-5 text-success" />,
            });
        } catch (err: any) {
            console.error("Gagal update profil:", err);
            toast.error("Gagal!", {
                description: err.response?.data?.message || "Data profil gagal diperbarui.",
                icon: <Lucide icon="AlertTriangle" className="w-5 h-5 text-danger" />,
            });
        } finally {
            setSavingProfile(false);
        }
    };

    // Submit ganti password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordForm.currentPassword) {
            toast.error("Kata sandi saat ini harus diisi.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Kata sandi baru minimal 8 karakter.");
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Konfirmasi kata sandi tidak cocok dengan kata sandi baru.");
            return;
        }

        setSavingPassword(true);
        try {
            const res = await api.put("/auth/change-password", {
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword,
            });

            toast.success("Berhasil!", {
                description: res.data?.message || "Kata sandi Anda berhasil diubah.",
                icon: <Lucide icon="CheckCircle2" className="w-5 h-5 text-success" />,
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            console.error("Gagal ubah kata sandi:", err);
            toast.error("Gagal!", {
                description: err.response?.data?.message || "Gagal mengubah kata sandi.",
                icon: <Lucide icon="AlertTriangle" className="w-5 h-5 text-danger" />,
            });
        } finally {
            setSavingPassword(false);
        }
    };

    // Submit Toggle 2FA
    const handleToggle2FA = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!twoFactorPassword) {
            toast.error("Masukkan kata sandi Anda untuk verifikasi perubahan 2FA.");
            return;
        }

        setSaving2FA(true);
        try {
            // Simulasi verifikasi status 2FA
            const nextStatus = !twoFactorEnabled;
            setTwoFactorEnabled(nextStatus);
            localStorage.setItem("eproc_2fa", nextStatus ? "true" : "false");

            toast.success("Berhasil!", {
                description: nextStatus
                    ? "Autentikasi Dua Faktor (2FA) telah berhasil diaktifkan."
                    : "Autentikasi Dua Faktor (2FA) telah dinonaktifkan.",
                icon: <Lucide icon="CheckCircle2" className="w-5 h-5 text-success" />,
            });

            setTwoFactorPassword("");
        } catch (err: any) {
            toast.error("Gagal memperbarui status 2FA.");
        } finally {
            setSaving2FA(false);
        }
    };

    // Submit Deaktivasi Akun
    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            await api.delete("/auth/delete-account");

            toast.success("Akun Dinonaktifkan", {
                description: "Akun Anda telah dinonaktifkan. Anda akan dialihkan ke halaman login.",
            });

            localStorage.removeItem("eproc_token");
            localStorage.removeItem("eproc_user");
            localStorage.removeItem("eproc_user_role");
            localStorage.removeItem("theme");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Gagal menonaktifkan akun.");
        } finally {
            setDeletingAccount(false);
            setDeleteModalOpen(false);
        }
    };

    // Logout
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
        } finally {
            localStorage.removeItem("eproc_token");
            localStorage.removeItem("eproc_user");
            localStorage.removeItem("eproc_user_role");
            localStorage.removeItem("theme");
            toast.success("Berhasil keluar.");
            navigate("/login");
        }
    };

    return (
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            <div className="col-span-12">
                <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
                    <div className="text-base font-medium text-slate-800 dark:text-white">
                        Pengaturan Profil & Keamanan
                    </div>
                    <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
                        <Button
                            variant="primary"
                            onClick={handleLogout}
                            className="bg-danger/80 hover:bg-danger text-white border-transparent"
                        >
                            <Lucide
                                icon="LogOut"
                                className="stroke-[1.3] w-4 h-4 mr-2"
                            />
                            Keluar
                        </Button>
                    </div>
                </div>

                <div className="mt-3.5 grid grid-cols-12 gap-y-10 gap-x-6">
                    {/* Sidebar Navigasi Menu Pengaturan */}
                    <div className="relative col-span-12 xl:col-span-3">
                        <div className="sticky top-[104px]">
                            <div className="flex flex-col px-5 pt-5 pb-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("profile")}
                                    className={clsx([
                                        "flex items-center py-3 px-3 rounded-md transition-colors text-left",
                                        activeTab === "profile"
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400 hover:text-primary",
                                    ])}
                                >
                                    <Lucide
                                        icon="UserRound"
                                        className="stroke-[1.5] w-4 h-4 mr-3"
                                    />
                                    {isVendor ? "Kontak PIC & Akun" : "Informasi Profil"}
                                </button>
                                {isVendor && (
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange("vendor-profile")}
                                        className={clsx([
                                            "flex items-center py-3 px-3 rounded-md transition-colors text-left mt-1",
                                            activeTab === "vendor-profile"
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400 hover:text-primary",
                                        ])}
                                    >
                                        <Lucide
                                            icon="Building2"
                                            className="stroke-[1.5] w-4 h-4 mr-3"
                                        />
                                        Profil Perusahaan
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("security")}
                                    className={clsx([
                                        "flex items-center py-3 px-3 rounded-md transition-colors text-left mt-1",
                                        activeTab === "security"
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400 hover:text-primary",
                                    ])}
                                >
                                    <Lucide
                                        icon="KeyRound"
                                        className="stroke-[1.5] w-4 h-4 mr-3"
                                    />
                                    Keamanan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("two-factor-authentication")}
                                    className={clsx([
                                        "flex items-center py-3 px-3 rounded-md transition-colors text-left mt-1",
                                        activeTab === "two-factor-authentication"
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400 hover:text-primary",
                                    ])}
                                >
                                    <Lucide
                                        icon="ShieldCheck"
                                        className="stroke-[1.5] w-4 h-4 mr-3"
                                    />
                                    2FA Autentikasi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange("account-deactivation")}
                                    className={clsx([
                                        "flex items-center py-3 px-3 rounded-md transition-colors text-left mt-1",
                                        activeTab === "account-deactivation"
                                            ? "bg-danger/10 text-danger font-semibold"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400 hover:text-danger",
                                    ])}
                                >
                                    <Lucide
                                        icon="Trash2"
                                        className="stroke-[1.5] w-4 h-4 mr-3"
                                    />
                                    Hapus Akun
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Area Konten */}
                    <div className="flex flex-col col-span-12 xl:col-span-9 gap-y-7">
                        {/* Banner & Avatar Foto */}
                        <div className="p-1.5 box flex flex-col box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                            <div className="h-48 sm:h-56 relative w-full rounded-[0.6rem] bg-gradient-to-r from-blue-600 via-sky-500 to-amber-400">
                                <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-1/2">
                                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-darkmode-600 shadow-lg overflow-hidden bg-white">
                                        <img
                                            alt="Foto Profil"
                                            src={profileImage}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col sm:flex-row gap-y-3 items-center sm:items-end justify-between pt-16 sm:pt-14 bg-slate-50/50 dark:bg-darkmode-700/50 rounded-b-lg">
                                <div className="text-center sm:text-left">
                                    <h3 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-white">
                                        {isVendor && vendorForm.nama_perusahaan
                                            ? vendorForm.nama_perusahaan
                                            : form.firstName
                                            ? `${form.firstName} ${form.lastName}`
                                            : form.username || "Pengguna"}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                                        <span
                                            className={clsx([
                                                "text-xs px-2.5 py-0.5 rounded-full font-medium",
                                                isVendor
                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                    : "bg-primary/10 text-primary",
                                            ])}
                                        >
                                            {isVendor
                                                ? `Vendor (${vendorForm.kualifikasi || "Penyedia"})`
                                                : form.role_name || "Admin"}
                                        </span>
                                        {isVendor && vendorForm.id_vendor_code && (
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono font-semibold">
                                                ID: {vendorForm.id_vendor_code}
                                            </span>
                                        )}
                                        {isVendor && (
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium flex items-center gap-1">
                                                <Lucide icon="ShieldCheck" className="w-3.5 h-3.5" />
                                                KSWP Valid
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-500 font-mono">
                                            @{form.username || "user"}
                                        </span>
                                    </div>
                                    {isVendor && (
                                        <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-2">
                                            <span>
                                                PIC: {form.firstName} {form.lastName}
                                            </span>
                                            {vendorForm.email_perusahaan && (
                                                <span className="text-slate-400">
                                                    • {vendorForm.email_perusahaan}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <Button
                                        variant="outline-primary"
                                        className="border-primary/50 relative overflow-hidden text-xs sm:text-sm"
                                    >
                                        <Lucide
                                            icon="Image"
                                            className="stroke-[1.3] w-4 h-4 mr-2"
                                        />
                                        <span>Ganti Foto</span>
                                        <FormInput
                                            id="upload-profile-photo"
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            name="profile"
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </Button>
                                    {isVendor && (
                                        <Button
                                            variant="primary"
                                            className="text-xs sm:text-sm"
                                            onClick={() => navigate("/dashboard/data-vendor")}
                                        >
                                            <Lucide
                                                icon="FileText"
                                                className="stroke-[1.3] w-4 h-4 mr-2"
                                            />
                                            <span>Dokumen Legalitas</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TAB 1: INFORMASI PROFIL */}
                        {activeTab === "profile" && (
                            <form onSubmit={handleSaveProfile}>
                                <div className="flex flex-col p-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                    <div className="pb-4 mb-6 font-bold text-slate-800 dark:text-white border-b border-dashed border-slate-200 dark:border-darkmode-400 text-base flex items-center justify-between">
                                        <span>{isVendor ? "Informasi Kontak PIC (Penanggung Jawab)" : "Informasi Umum Pengguna"}</span>
                                        <span className="text-xs font-normal text-slate-400">
                                            {isVendor ? "Perbarui data penanggung jawab akun" : "Perbarui data identitas Anda"}
                                        </span>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Nama Depan & Belakang */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Nama Lengkap</div>
                                                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 dark:bg-darkmode-700 dark:border-darkmode-500">
                                                            Harus diisi
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Nama depan dan belakang Anda
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <FormInput
                                                        value={form.firstName}
                                                        name="firstName"
                                                        onChange={handleProfileChange}
                                                        type="text"
                                                        placeholder="Nama Depan (Contoh: Ahmad)"
                                                        required
                                                    />
                                                    <FormInput
                                                        value={form.lastName}
                                                        name="lastName"
                                                        onChange={handleProfileChange}
                                                        type="text"
                                                        placeholder="Nama Belakang (Contoh: Fauzi)"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Username (Readonly) */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Username</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        ID Pengguna untuk login
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="text"
                                                    value={form.username}
                                                    disabled
                                                    className="bg-slate-100 dark:bg-darkmode-700 cursor-not-allowed text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Alamat Email</div>
                                                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 dark:bg-darkmode-700 dark:border-darkmode-500">
                                                            Harus diisi
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Email resmi untuk notifikasi
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="email"
                                                    placeholder="nama@email.com"
                                                    value={form.email}
                                                    name="email"
                                                    onChange={handleProfileChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex pt-5 mt-6 border-t border-dashed border-slate-200 dark:border-darkmode-400 justify-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={savingProfile}
                                            className="px-6"
                                        >
                                            <Lucide icon="Save" className="w-4 h-4 mr-2" />
                                            {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB KHUSUS: PROFIL PERUSAHAAN (VENDOR) */}
                        {isVendor && activeTab === "vendor-profile" && (
                            <form onSubmit={handleSaveVendor}>
                                <div className="flex flex-col p-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                    <div className="pb-4 mb-6 font-bold text-slate-800 dark:text-white border-b border-dashed border-slate-200 dark:border-darkmode-400 text-base flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Lucide icon="Building2" className="w-5 h-5 text-primary" />
                                            <span>Identitas Resmi Perusahaan Penyedia</span>
                                        </div>
                                        <span className="text-xs font-normal text-slate-400">
                                            Data legalitas dasar vendor di sistem ACQUIRAS
                                        </span>
                                    </div>

                                    {/* Callout Info & Shortcut ke Data Vendor */}
                                    <div className="p-4 rounded-lg bg-blue-50/70 dark:bg-darkmode-700/60 border border-blue-200/60 dark:border-darkmode-500 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex gap-3">
                                            <Lucide icon="Info" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Untuk mengunggah dan mengelola dokumen kualifikasi lengkap (Izin Usaha/NIB, Akta Perusahaan, Pemilik Saham, Susunan Pengurus, SDM Ahli, Pengalaman Kerja, dan Peralatan), silakan akses menu <strong>Data Vendor</strong>.
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            className="text-xs flex-shrink-0 whitespace-nowrap"
                                            onClick={() => navigate("/dashboard/data-vendor")}
                                        >
                                            <Lucide icon="ExternalLink" className="w-3.5 h-3.5 mr-1.5" />
                                            Buka Data Vendor
                                        </Button>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Kode Vendor & KSWP */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Kode Vendor & Status KSWP</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Nomor registrasi unik penyedia
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <FormInput
                                                            type="text"
                                                            value={vendorForm.id_vendor_code || "VND-AUTO"}
                                                            disabled
                                                            className="bg-slate-100 dark:bg-darkmode-700 font-mono font-bold text-primary cursor-not-allowed"
                                                        />
                                                        <div className="text-[11px] text-slate-400 mt-1">ID Terdaftar Sistem</div>
                                                    </div>
                                                    <div className="flex items-center px-4 py-2 rounded-md bg-emerald-50 dark:bg-darkmode-700 border border-emerald-200 dark:border-darkmode-500">
                                                        <Lucide icon="ShieldCheck" className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                                                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                                            Konfirmasi Status Wajib Pajak (KSWP) Valid
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nama Perusahaan & Bentuk Usaha */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Nama Perusahaan</div>
                                                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 dark:bg-darkmode-700 dark:border-darkmode-500">
                                                            Wajib
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Nama badan usaha dan bentuk badan
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div className="sm:col-span-2">
                                                        <FormInput
                                                            type="text"
                                                            name="nama_perusahaan"
                                                            value={vendorForm.nama_perusahaan}
                                                            onChange={handleVendorChange}
                                                            placeholder="Contoh: PT Solusi Teknologi Nusantara"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormSelect
                                                            name="bentuk_usaha"
                                                            value={vendorForm.bentuk_usaha}
                                                            onChange={handleVendorChange}
                                                        >
                                                            <option value="PT">PT (Perseroan Terbatas)</option>
                                                            <option value="CV">CV (Commanditaire Vennootschap)</option>
                                                            <option value="Firma">Firma</option>
                                                            <option value="Koperasi">Koperasi</option>
                                                            <option value="Perorangan">Perorangan</option>
                                                            <option value="BUMN">BUMN / BUMD</option>
                                                            <option value="Lainnya">Lainnya</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* NPWP & Kualifikasi */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">NPWP & Kualifikasi Usaha</div>
                                                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 dark:bg-darkmode-700 dark:border-darkmode-500">
                                                            Wajib
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Nomor pokok wajib pajak dan skala usaha
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <FormInput
                                                            type="text"
                                                            name="npwp"
                                                            value={vendorForm.npwp}
                                                            onChange={handleVendorChange}
                                                            placeholder="Contoh: 01.234.567.8-901.000"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormSelect
                                                            name="kualifikasi"
                                                            value={vendorForm.kualifikasi}
                                                            onChange={handleVendorChange}
                                                        >
                                                            <option value="Kecil">Kecil (Usaha Mikro / Kecil)</option>
                                                            <option value="Menengah">Menengah</option>
                                                            <option value="Besar">Besar (Non-Kecil)</option>
                                                        </FormSelect>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Kantor & Website */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Status Kantor & Website</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Kedudukan kantor dan tautan website
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <FormSelect
                                                            name="status_cabang"
                                                            value={vendorForm.status_cabang}
                                                            onChange={handleVendorChange}
                                                        >
                                                            <option value={0}>Kantor Pusat</option>
                                                            <option value={1}>Kantor Cabang</option>
                                                        </FormSelect>
                                                    </div>
                                                    <div>
                                                        <FormInput
                                                            type="text"
                                                            name="website"
                                                            value={vendorForm.website}
                                                            onChange={handleVendorChange}
                                                            placeholder="https://perusahaan.co.id"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Kontak Resmi Perusahaan (Email & Telepon) */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Kontak Resmi Kantor</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Email resmi dan nomor telepon operasional
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <FormInput
                                                            type="email"
                                                            name="email_perusahaan"
                                                            value={vendorForm.email_perusahaan}
                                                            onChange={handleVendorChange}
                                                            placeholder="info@perusahaan.com"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <FormInput
                                                            type="text"
                                                            name="no_telepon"
                                                            value={vendorForm.no_telepon}
                                                            onChange={handleVendorChange}
                                                            placeholder="Contoh: 021-1234567 atau 0812345678"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alamat Lengkap */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-start">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10 pt-2">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Alamat Lengkap Perusahaan</div>
                                                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200 dark:bg-darkmode-700 dark:border-darkmode-500">
                                                            Wajib
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Jalan, nomor gedung/kantor, RT/RW, kelurahan
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormTextarea
                                                    name="alamat"
                                                    value={vendorForm.alamat}
                                                    onChange={handleVendorChange}
                                                    placeholder="Alamat domisili lengkap perusahaan..."
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Wilayah (Provinsi, Kota/Kab, Kode Pos) */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Provinsi, Kota & Kode Pos</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Wilayah yurisdiksi kantor
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <FormInput
                                                        type="text"
                                                        name="provinsi"
                                                        value={vendorForm.provinsi}
                                                        onChange={handleVendorChange}
                                                        placeholder="Provinsi (contoh: DKI Jakarta)"
                                                    />
                                                    <FormInput
                                                        type="text"
                                                        name="kabupaten_kota"
                                                        value={vendorForm.kabupaten_kota}
                                                        onChange={handleVendorChange}
                                                        placeholder="Kota/Kabupaten"
                                                    />
                                                    <FormInput
                                                        type="text"
                                                        name="kode_pos"
                                                        value={vendorForm.kode_pos}
                                                        onChange={handleVendorChange}
                                                        placeholder="Kode Pos"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex pt-5 mt-6 border-t border-dashed border-slate-200 dark:border-darkmode-400 justify-end gap-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={savingVendor}
                                            className="px-6"
                                        >
                                            <Lucide icon="Save" className="w-4 h-4 mr-2" />
                                            {savingVendor ? "Menyimpan Data..." : "Simpan Profil Perusahaan"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 2: KEAMANAN (GANTI PASSWORD) */}
                        {activeTab === "security" && (
                            <form onSubmit={handleChangePassword}>
                                <div className="flex flex-col p-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                    <div className="pb-4 mb-6 font-bold text-slate-800 dark:text-white border-b border-dashed border-slate-200 dark:border-darkmode-400 text-base flex items-center justify-between">
                                        <span>Pengaturan Kata Sandi</span>
                                        <span className="text-xs font-normal text-slate-400">
                                            Perbarui kata sandi secara berkala
                                        </span>
                                    </div>

                                    <div className="space-y-5">
                                        {/* Kata Sandi Lama */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Kata Sandi Saat Ini</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Masukkan kata sandi lama Anda
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Kata Sandi Baru */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Kata Sandi Baru</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Minimal 8 karakter
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Konfirmasi Kata Sandi */}
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Ulangi Kata Sandi Baru</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Harus sama dengan kata sandi baru
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="password"
                                                    placeholder="••••••••••••"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex pt-5 mt-6 border-t border-dashed border-slate-200 dark:border-darkmode-400 justify-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={savingPassword}
                                            className="px-6"
                                        >
                                            <Lucide icon="Key" className="w-4 h-4 mr-2" />
                                            {savingPassword ? "Memperbarui..." : "Ubah Kata Sandi"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 3: 2FA AUTENTIKASI */}
                        {activeTab === "two-factor-authentication" && (
                            <form onSubmit={handleToggle2FA}>
                                <div className="flex flex-col p-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-dashed border-slate-200 dark:border-darkmode-400">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-800 dark:text-white text-base">
                                                Autentikasi Dua Faktor (2FA)
                                            </span>
                                            <span
                                                className={clsx([
                                                    "px-2.5 py-0.5 text-xs font-semibold rounded-full",
                                                    twoFactorEnabled
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                        : "bg-slate-100 text-slate-600 dark:bg-darkmode-700 dark:text-slate-400",
                                                ])}
                                            >
                                                {twoFactorEnabled ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-darkmode-700/60 border border-slate-200/60 dark:border-darkmode-500 mb-6">
                                        <div className="flex gap-3">
                                            <Lucide icon="ShieldAlert" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                2FA memberikan lapisan keamanan ekstra untuk melindungi akses akun dan penawaran tender Anda di ACQUIRAS. Setelah aktif, setiap login akan memverifikasi kode otentikasi.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex-col block sm:flex xl:flex-row xl:items-center">
                                            <label className="inline-block mb-2 sm:mb-0 sm:mr-5 xl:w-60 xl:mr-10">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Kata Sandi Akun</div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Konfirmasi kata sandi untuk mengubah status 2FA
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="flex-1 w-full mt-2 xl:mt-0">
                                                <FormInput
                                                    type="password"
                                                    placeholder="Masukkan kata sandi akun"
                                                    value={twoFactorPassword}
                                                    onChange={(e) => setTwoFactorPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex pt-5 mt-6 border-t border-dashed border-slate-200 dark:border-darkmode-400 justify-end">
                                        <Button
                                            type="submit"
                                            variant={twoFactorEnabled ? "outline-danger" : "primary"}
                                            disabled={saving2FA}
                                            className="px-6"
                                        >
                                            <Lucide icon="Shield" className="w-4 h-4 mr-2" />
                                            {saving2FA
                                                ? "Memproses..."
                                                : twoFactorEnabled
                                                ? "Nonaktifkan 2FA"
                                                : "Aktifkan 2FA"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* TAB 4: HAPUS / NONAKTIFKAN AKUN */}
                        {activeTab === "account-deactivation" && (
                            <div className="flex flex-col p-6 box box--stacked bg-white dark:bg-darkmode-600 rounded-lg shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <div className="pb-4 mb-4 font-bold text-danger text-base border-b border-dashed border-slate-200 dark:border-darkmode-400 flex items-center gap-2">
                                    <Lucide icon="AlertTriangle" className="w-5 h-5" />
                                    <span>Penonaktifan Akun</span>
                                </div>

                                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
                                    <p>
                                        Saat Anda menonaktifkan akun, akun Anda tidak akan dapat lagi digunakan untuk mengakses sistem pengadaan atau mengajukan penawaran lelang.
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Data riwayat transaksi, penawaran lelang yang telah diajukan, dan kontrak yang telah ditandatangani akan tetap diarsipkan sesuai regulasi audit pengadaan.
                                    </p>
                                </div>

                                <div className="mt-5 p-4 rounded-lg bg-danger/5 border border-danger/20">
                                    <FormCheck>
                                        <FormCheck.Input
                                            id="confirm-deactivate-checkbox"
                                            type="checkbox"
                                            checked={confirmDelete}
                                            onChange={(e) => setConfirmDelete(e.target.checked)}
                                        />
                                        <FormCheck.Label htmlFor="confirm-deactivate-checkbox" className="text-xs text-danger font-medium ml-2">
                                            Saya memahami konsekuensi dan menyetujui penonaktifan akun ini.
                                        </FormCheck.Label>
                                    </FormCheck>
                                </div>

                                <div className="flex pt-5 mt-6 border-t border-dashed border-slate-200 dark:border-darkmode-400 justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="danger"
                                        disabled={!confirmDelete}
                                        onClick={() => setDeleteModalOpen(true)}
                                        className="px-6 disabled:opacity-50"
                                    >
                                        <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                                        Nonaktifkan Akun Saya
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Dialog Konfirmasi Deaktivasi Akun */}
            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-[70]">
                <Dialog.Panel className="p-6 w-full max-w-md mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
                        <Lucide icon="AlertTriangle" className="w-6 h-6" />
                    </div>
                    <Dialog.Title className="text-base font-bold text-slate-800 dark:text-white">
                        Konfirmasi Penonaktifan Akun
                    </Dialog.Title>
                    <div className="text-xs text-slate-500 mt-2">
                        Apakah Anda benar-benar yakin ingin menonaktifkan akun ini? Sesi login Anda akan langsung dihentikan.
                    </div>
                    <div className="flex justify-center gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => setDeleteModalOpen(false)}
                            disabled={deletingAccount}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                        >
                            {deletingAccount ? "Memproses..." : "Ya, Nonaktifkan"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default Main;
