import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export interface User {
    id: string;
    email: string;
}

export interface Note {
    noteId: string;
    title?: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

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
        api.get("/auth/status")
            .then(res => {
                if (!res.ok) {
                    return null;
                };
                return res.json()
            })
            .then(data => setUser({ id: data?.user?._id, email: data?.user?.email }))
            .catch((err: Error) => {
                if (err.name === "TypeError") {
                    toast.error("Server unavailable. Please try again");
                }
                else {
                    toast.error(err?.message || String(err));
                }
                console.log(err)
            })
            .finally(() => setLoading(false))
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