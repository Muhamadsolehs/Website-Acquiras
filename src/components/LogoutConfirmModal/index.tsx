import { Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[9999]">
      <Dialog.Panel className="p-6 w-full max-w-sm sm:max-w-md mx-auto bg-white dark:bg-darkmode-600 rounded-xl shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
          <Lucide icon="LogOut" className="w-7 h-7" />
        </div>
        <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white">
          Konfirmasi Keluar Sistem
        </Dialog.Title>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Apakah Anda yakin ingin keluar dari akun ACQUIRAS? Anda perlu masuk kembali untuk mengakses sistem pengadaan.
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onClose}
            disabled={loading}
            className="px-5 w-28"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 w-28 bg-danger text-white border-transparent"
          >
            {loading ? "Keluar..." : "Ya, Keluar"}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
