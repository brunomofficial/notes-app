import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Outlet } from "react-router-dom";

export default function PublicRoute() {
    const { user } = useApp();

    if (user) 
        return <Navigate to="/" replace />

    return <Outlet />
}