import {useState} from "react";
import toast from "react-hot-toast";
import { api } from "../../utils/api"
import { useApp } from "../../context/AppContext";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./Profile.css";

export default function Profile() {
    const { user, setUser, notes } = useApp(); 

    if (!user) return <div>Loading...</div>

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const logout = async () => {
        try {
            const response = await api.post("/auth/logout");
            const data = await response.json() as any;
            if (!response.ok) {
                toast.error(data?.error || "Failed to log out, please try again");
                return;
            }
            toast.success(data.message);
            setUser(null);
        }
        catch (err) {
            console.log(err)
        }
    }

    return(
        <div className="profile-page page">
            <h2>Profile</h2>
            <span>Email: {user.email}</span>
            <span>Notes count: {notes.length}</span>
            <button 
                onClick={() => setShowLogoutDialog(true)} 
                className="logout-btn">
                Log out
            </button>

            {showLogoutDialog && (
                <ConfirmDialog
                    title={"Log out"}
                    message={"Press confirm to log out"}
                    onConfirm={() => {
                        logout(); 
                        setShowLogoutDialog(false)
                        }
                    } 
                    onCancel={()=>setShowLogoutDialog(false)}
                />
            )}
        </div>
    )
}