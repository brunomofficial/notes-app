import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../utils/api";

export interface User {
    id: string;
    email: string;
}

export interface Note {
    noteId: string;
    title: string | null;
    content: string;
    createdAt?: string;
    updatedAT?: string;
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
        const initAuth = async () => {
            try {
                const response = await api.get("/auth/status");
                const data = await response.json();
                if (!response.ok || !data.user) {
                    return;
                }
                setUser({ id: data.user._id, email: data.user.email });
            }
            catch (err) {

            }
            finally {
                setLoading(false);
            }
        }
        initAuth();
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