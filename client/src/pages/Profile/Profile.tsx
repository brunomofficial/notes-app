import {useState} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api"
import { useApp } from "../../context/AppContext";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./Profile.css";

export default function Profile() {
    const { user, setUser, setNotes, notes, guestMode, setGuestMode } = useApp();
    const navigate = useNavigate(); 
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    if (!user && !guestMode) 
        return <div>Loading...</div>

    const exitGuestMode = () => {
        setGuestMode(false);
        navigate("/login");
    }

    const logout = async () => {
        try {
            const response = await api.post("/auth/logout");
            const data = await response.json() as { message?: string };

            toast.success(data.message || "Logged out successfully");
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setUser(null);
        }
    }

    const deleteAccount = async () => {
        try {
            const response = await api.post("/auth/delete-account");
            const data = await response.json() as { message?: string; error?: string };

            if (!response.ok) {
                throw new Error(data.error || "Could not delete your account");
            }

            setUser(null);
            setNotes([]);
            toast.success(data.message || "Account deleted successfully");
            navigate("/login");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not delete your account");
            console.log(err);
        }
    }

    return(
        <div className="profile-page page">
            <h2>Profile</h2>
            <div className="profile-details">
                {user ? (
                    <div className="profile-detail-row">
                        <span>Email</span>
                        <span>{user?.email}</span>
                    </div>
                ) : (
                    <div className="profile-detail-row">
                        <span>Mode</span>
                        <span>Guest</span>
                    </div>
                )
                }

                <div className="profile-detail-row">
                    <span>Notes count</span>
                    <span>{notes.length}</span>
                </div>
            </div>

            <button 
                onClick={() => setShowLogoutDialog(true)} 
                className="logout-btn"
            >          
                {guestMode ? "Exit guest mode" : "Log out"}
            </button>

            {user && (
                <button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="delete-account-btn"
                >
                    Delete Account
                </button>
            )}

            {showLogoutDialog && (
                <ConfirmDialog
                    title={guestMode ? "Exit guest mode?" : "Log out"}
                    message={guestMode ? "Press confirm to exit guest mode" : "Press confirm to log out"}
                    onConfirm={() => {
                        if (guestMode) {
                            exitGuestMode();
                        } else {
                            logout();
                        }

                        setShowLogoutDialog(false);
                        }
                    } 
                    onCancel={()=>setShowLogoutDialog(false)}
                />
            )}

            {showDeleteDialog && (
                <ConfirmDialog
                    title="Delete account?"
                    message="This permanently deletes your account and all of your notes. This action cannot be undone."
                    onConfirm={() => {
                        setShowDeleteDialog(false);
                        void deleteAccount();
                    }}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </div>
    )
}
