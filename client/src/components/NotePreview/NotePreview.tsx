import { useNavigate } from "react-router-dom";
import { type Note } from "../../models/note";
import "./NotePreview.css";

export default function NotePreview({ note }: { note: Note }) {
    const navigate = useNavigate();
    const noteId = note.noteId;

    // To add note preview menu on right click
    
    return (
        <div className="note-preview" onClick={() => navigate(`/notes/${noteId}`)}>
            <span className="note-preview-title">{note?.title}</span>
            <span className="note-preview-content">{note.content}</span>
        </div>
    );
}