import axios from "axios";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject({ ...error, quiet: true });
    }
    return Promise.reject(error);
  }
);

export default api;
