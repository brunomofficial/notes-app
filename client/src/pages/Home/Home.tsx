import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import NotePreview from "../../components/NotePreview/NotePreview";
import "./Home.css"

export default function Home() {
    const navigate = useNavigate();
    const { notes, setNotes } = useApp();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || "Failed to retrieve notes");
                return;
            }
            console.log("Data:",data)
            setNotes(data.map(n => ({
                noteId: n.noteId,
                title: n.title,
                content: n.content,
            })));
        }
        catch (err) {
            console.log(err)
        }  
    }

    const NoteList = () => {
        if (!notes) {
            return;
        }

        if (notes.length < 1) {
            return (
                <button className="no-notes-yet-btn"
                    onClick={() => {navigate("/notes/new")}}
                >
                    No notes yet. Create a new note
                </button>
            );
        }

        return (
            <div className="note-list">
                {notes.map((note, i) => (<NotePreview note = {note} key={i}/>)
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