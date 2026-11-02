import { useNavigate } from "react-router-dom";
import { useApp} from "../../context/AppContext";
import { type Note } from "../../models/note";
import NotePreview from "../../components/NotePreview/NotePreview";
import "./Home.css"

export default function Home() {
    const navigate = useNavigate();
    const { notes } = useApp();

    const NoteList = () => {
        if (!notes) {
            return;
        }

        if (notes.length < 1) {
            return (
                <button className="first-note-btn"
                    onClick={() => { navigate("/notes/new") }}
                >
                    Create a note
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
                <h3>Notes</h3>
                <NoteList />
            </div>
        </div>
    );
}