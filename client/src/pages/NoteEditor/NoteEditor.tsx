import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { useApp, type Note } from "../../context/AppContext";
import { useEffect } from "react";
import { api } from "../../utils/api";
import "./NoteEditor.css"

export default function NoteEditor() {
    const navigate = useNavigate();
    const { noteId } = useParams<{noteId: string}>();

    const { notes } = useApp();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!noteId) {
        navigate(-1);
        toast.error("Failed to fetch note");
        return;
    }

    const renderExistingNote = () => {
        const note = notes.find(n => n.noteId === noteId);
        if (!note) {
            toast.error("Failed to select note");
            return;
        }
        setTitle(note.title || "");
        setContent(note.content || "");
        return;
    }

    useEffect(() => {
        if (noteId !== "new") {
            renderExistingNote();
        }
    }, []);

    const saveNote = () => {
        if (content === "") {
            toast.error("Please add note content in order to save note");
            return;
        }

        if (noteId === "new") {
            addNewNote(content, title);
        }
        else {
            updateNote(content, title);
        }
    }

    const addNewNote = async (content: string, title?: string, ) => {
        const response = await api.post("/notes", {title, content});
        const data = await response.json();
        if (!response.ok) {
            toast.error("Failed to create note, please try again");
            return;
        }
        toast.success("Note created successfully");
        console.log(data);
        navigate(`/notes/${data?._id}`);
    }

    const updateNote = async (content: string, title?: string, ) => {
        const response = await api.put(`/notes/${noteId}`, {title, content});
        const data = await response.json();
        if (!response.ok) {
            return toast.error("Failed to update note");
        }
        toast.success("Updated notes successfully");
        navigate(`/notes/${noteId}`);
    }

    const deleteNote = async () => {
        if (!noteId) {
            return;
        }
        const response = await api.delete(`/notes/${noteId}`);
        const data = await response.json();
        if (!response.ok) {
            toast.error(data?.error || "Failed to delete note, please try again");
            return;
        }
        toast.success("Note deleted successfully");
        navigate("/");
    }

    return (
        <div className="note-editor-page page">
            <h2>Note Editor</h2>
            <div className="note-container">
                <div className="note-editor-btns">
                    <button className="save-note-btn" onClick={saveNote}>save</button>
                    <button className="del-note-btn" onClick={deleteNote}>del</button>
                </div>
                <label>Title</label>
                <input 
                    className="title-input" 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label>Content</label>
                <textarea 
                    className="note-input"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
        </div>
    );
}