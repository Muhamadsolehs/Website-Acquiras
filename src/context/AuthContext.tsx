import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/api/axiosinstance";

interface AuthContextType {
    isAuthenticated: boolean | null;
    loading: boolean;
    setIsAuthenticated: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: null,
    loading: true,
    setIsAuthenticated: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me");
                setIsAuthenticated(true);
                const userData = res.data.user;
                const filteredUser = {
                    name: userData.name,
                    email: userData.email,
                };
                localStorage.setItem("user", JSON.stringify(filteredUser));
            } catch (err: any) {
                if (err.response?.status !== 401) {
                    console.error("❌ Auth check error:", err);
                }
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loading, setIsAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
