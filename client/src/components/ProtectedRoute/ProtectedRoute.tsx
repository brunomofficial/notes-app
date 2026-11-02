import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { user, guestMode, loading } = useApp();

    if (loading) return null;
    
    if (!user && !guestMode) 
        return <Navigate to="/login" replace />
    
    return <Outlet />
}