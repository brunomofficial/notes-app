import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { type User } from "../models/user";
import { type Note } from "../models/note";
import { api } from "../utils/api";

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAppData = async () => {
            try {
                const statusRes = await api.get("/auth/status");

                if (!statusRes.ok) {
                    setUser(null);
                    return;
                }

                const data = await statusRes.json();
                setUser({ id: data.user._id, email: data.user.email });

                const notesRes = await api.get("/notes");

                if (!notesRes.ok) {
                    toast.error("Failed to load notes");
                    return;
                }

                const notesData = await notesRes.json();
                setNotes(notesData.notes);
            }
            catch (err) {
                const error = err as Error;
                setUser(null);

                if (error.name === "TypeError") {
                    toast.error("Server unavailable. Please try again");
                }
                else {
                    toast.error(error.message || String(err));
                }

                console.log(err);
            }
            finally {
                setLoading(false);
            }
        }

        loadAppData();
    }, []);

    return (
        <AppContext.Provider value={{user, setUser, notes, setNotes, loading}}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}  

