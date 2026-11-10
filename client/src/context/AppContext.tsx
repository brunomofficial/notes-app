import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { type User } from "../models/user";
import { type Note } from "../models/note";
import { api } from "../utils/api";

const GUEST_MODE_KEY = "notes-app-guest-mode";
const GUEST_NOTES_KEY = "notes-app-guest-notes";
const THEME_KEY = "notes-app-theme";

interface AppContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    loading: boolean;
    guestMode: boolean;
    setGuestMode: (enabled: boolean) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem(THEME_KEY) === "dark"
    );

    useEffect(() => {
        document.documentElement.dataset.theme = darkMode ? "dark" : "light";
        localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode((enabled) => !enabled);

    const [guestMode, setGuestModeState] = useState(
        () => localStorage.getItem(GUEST_MODE_KEY) === "true"
    );

    const setGuestMode = (enabled: boolean) => {
        setGuestModeState(enabled);

        if (enabled) {
            localStorage.setItem(GUEST_MODE_KEY, "true");
        }
        else {
            localStorage.removeItem(GUEST_MODE_KEY);
        }
    }   

    const [notes, setNotes] = useState<Note[]>([]);
    const [guestNotesLoaded, setGuestNotesLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAppData = async () => {
            try {
                if (guestMode) {
                    setUser(null);
                    const savedNotes = localStorage.getItem(GUEST_NOTES_KEY);

                    try {
                        if (savedNotes) {
                            const parsedNotes: unknown = JSON.parse(savedNotes);
                            setNotes(Array.isArray(parsedNotes) ? parsedNotes as Note[] : []);
                        }
                        else {
                            setNotes([]);
                        }

                    } catch {
                        localStorage.removeItem(GUEST_NOTES_KEY);
                        setNotes([]);
                        toast.error("Could not load saved guest notes");
                    }  finally {
                        setGuestNotesLoaded(true);
                    }

                    return;
                }

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
    }, [guestMode]);

    useEffect(() => {
        if (!guestMode || !guestNotesLoaded) return;

        localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
    }, [guestMode, guestNotesLoaded, notes]);

    return (
        <AppContext.Provider 
            value={{
                user, 
                setUser, 
                notes, 
                setNotes, 
                loading,
                guestMode,
                setGuestMode,
                darkMode,
                toggleDarkMode
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}  

