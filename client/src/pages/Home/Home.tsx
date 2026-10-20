import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp, type Note } from "../../context/AppContext";
import { api } from "../../utils/api";
import NotePreview from "../../components/NotePreview/NotePreview";
import "./Home.css"

export default function Home() {
    const navigate = useNavigate();
    const { notes, setNotes } = useApp();

    useEffect(() => {
        api.get("/notes")
            .then(res => {
                if (!res.ok) {
                    toast.error("Error fetching notes");
                    return;
                }

                return res.json()
            })
            .then(data => setNotes(data?.notes))
            .catch((err: Error) => {
                if (err.name == "TypeError") {
                    toast.error("Server unreachable, please try again")
                }
                else {
                    toast.error(err?.message || String(err));
                }
                console.log(err);
            })
    }, []);


    const NoteList = () => {
        if (!notes) {
            return;
        }

        if (notes.length < 1) {
            return (
                <button className="no-notes-yet-btn"
                    onClick={() => { navigate("/notes/new") }}
                >
                    No notes yet. Create a new note
                </button>
            );
        }

        return (
            <div className="note-list">
                {notes.map((note: Note, i) => (<NotePreview note={note} key={i} />)
                )}
            </div>
        );
    }

    return (
        <div className="home-page page">
            <div className="note-list">
                <h2>Home</h2>
                <h3>Notes</h3>
                <NoteList />
            </div>
        </div>
    );
}