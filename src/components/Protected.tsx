import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoadingIcon from "../components/LoadingCard";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const LOGIN_SITE = import.meta.env.VITE_URL_BACK || "http://localhost:3000";



    useEffect(() => {
        if (!loading && !isAuthenticated) {
            window.location.href = `${LOGIN_SITE}/login`;
        }
    }, [loading, isAuthenticated]);

    if (loading) {
        return <LoadingIcon text="Checking authentication..." size={12} />;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return null;
}
