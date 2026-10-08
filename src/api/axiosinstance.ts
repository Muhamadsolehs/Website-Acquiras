import axios from "axios";

// Default base URL: uses VITE_API_BASE_URL or falls back to http://127.0.0.1:8000/api
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Sisipkan Authorization Bearer token otomatis dari localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eproc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Jika token expired atau unauthenticated, bersihkan state & redirect jika bukan di halaman auth
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        localStorage.removeItem("eproc_token");
        localStorage.removeItem("eproc_user");
        localStorage.removeItem("eproc_user_role");
        window.location.href = "/login";
      }
      return Promise.reject({ ...error, quiet: true });
    }
    return Promise.reject(error);
  }
);

export default api;
