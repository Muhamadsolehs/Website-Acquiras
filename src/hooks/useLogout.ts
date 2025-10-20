import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosinstance";
import { useAuth } from "@/context/AuthContext";

export default function useLogout() {
    const LOGIN_SITE = import.meta.env.VITE_URL_BACK || "http://localhost:3000";

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setIsAuthenticated } = useAuth();

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await api.post("/auth/logout", {}, { withCredentials: true });

            // localStorage.removeItem("access_token"); 
            // localStorage.removeItem("refresh_token");

            localStorage.removeItem("user");
            setIsAuthenticated(false);


            window.location.href = `${LOGIN_SITE}/login`;
        } catch (err: any) {
            console.error("Logout failed:", err);
            setError(err.response?.data?.error || "Logout failed");
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            window.location.href = `${LOGIN_SITE}/login`;
        } finally {
            setLoading(false);
        }
    };

    return { logout, loading, error };
}
