import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { type ReactNode } from "react";


export default function PublicRoute({ children } : { children: ReactNode }) {
    const { user } = useApp();
    if (user) return <Navigate to="/" replace />;
    return <>{children}</>
}