import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/api/axiosinstance";

interface AuthContextType {
    isAuthenticated: boolean | null;
    loading: boolean;
    setIsAuthenticated: (val: boolean) => void;
    updateUser: (data: Record<string, any>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: null,
    loading: true,
    setIsAuthenticated: () => { },
    updateUser: async () => { },
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
                localStorage.setItem("user", JSON.stringify(userData));
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

    const updateUser = async (data: Record<string, any>) => {
        try {
            const res = await api.put("/auth/update", data, {withCredentials: true});
            const userData = res.data.user;
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (err: any) {
            console.error("❌ Update user error:", err);
        }
    };


    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loading, setIsAuthenticated, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
