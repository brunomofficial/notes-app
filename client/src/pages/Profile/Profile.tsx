import {useState} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api"
import { useApp } from "../../context/AppContext";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./Profile.css";

export default function Profile() {
    const { user, setUser, notes, guestMode, setGuestMode } = useApp();
    const navigate = useNavigate(); 
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    if (!user && !guestMode) 
        return <div>Loading...</div>

    const exitGuestMode = () => {
        setGuestMode(false);
        navigate("/login");
    }

    const logout = async () => {
        try {
            const response = await api.post("/auth/logout");
            const data = await response.json() as any;

            toast.success(data.message);
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setUser(null);
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
        </div>
    )
}
