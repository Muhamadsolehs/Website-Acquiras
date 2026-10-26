const GuestRoute = ({ children }: { children: JSX.Element }) => {
  // Biarkan halaman login dan register tetap dapat diakses langsung oleh pengguna
  // tanpa auto-redirect yang memblokir pengguna saat ingin login ulang atau berganti akun.
  return children;
};

export default GuestRoute;
