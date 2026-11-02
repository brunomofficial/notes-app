import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Outlet } from "react-router-dom";

export default function PublicRoute() {
    const { user, loading } = useApp();

    if (loading) return null;

    if (user) 
        return <Navigate to="/" replace />

    return <Outlet />
}