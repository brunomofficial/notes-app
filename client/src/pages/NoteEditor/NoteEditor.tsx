import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import SaveIcon from "../../assets/icons/SaveIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./NoteEditor.css";

const MAX_NOTE_CHARS = 10_000;
const MAX_NOTES_PER_USER = 200;

export default function NoteEditor() {
    const navigate = useNavigate();
    const { noteId } = useParams<{ noteId: string }>();

    const { notes, setNotes, guestMode } = useApp();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (!noteId || noteId === "new") return;

        const note = notes.find(n => n.noteId === noteId);

        if (!note) return;

        setTitle(note.title || "");
        setContent(note.content || "");
    }, [noteId, notes]);

    const addNewNote = useCallback(async (content: string, title?: string) => {
        try {
            const response = await api.post("/notes", { title, content });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data?.error || "Failed to create note, please try again");
                return;
            }

            const { note } = data;

            if (!note) {
                toast.error("Error creating note");
                return;
            }

            if (!note._id) {
                toast.error("Error navigating to created note");
                navigate("/");
                return;
            }

            toast.success("Note created successfully");

            setNotes([
                ...notes,
                {
                    noteId: note._id,
                    title: note.title || "",
                    content: note.content,
                    createdAt: note.createdAt,
                    updatedAt: note.updatedAt,
                }
            ]);

            navigate(`/notes/${note?._id}`);
        }
        catch (err: Error | any) {
            console.error(err);
            toast.error(err?.message);
        }
    }, [navigate, notes, setNotes]); 

    const updateNote = useCallback(async (content: string, title?: string) => {
        try {
            const response = await api.put(`/notes/${noteId}`, { title, content });
            const data = await response.json();

            if (!response.ok || !data.note) {
                toast.error(data?.error || "Failed to update note");
                return;
            }

            toast.success("Updated note successfully");

            const { note } = data;

            if (!note._id) {
                toast.error("Error navigating to note");
                navigate("/");
                return;
            }

            setNotes(notes.map(n =>
                n.noteId === noteId
                    ? { ...n, title: note.title || "", content: note.content }
                    : n
            ));

            navigate(`/notes/${noteId}`);
        }
        catch (err: Error | any) {
            console.log(err);
            toast.error(err?.message);
        }
    }, [navigate, noteId, notes, setNotes]); 

    const handleSaveNote = useCallback(() => {
        if (content === "") {
            toast.error("Please add note content in order to save note");
            return;
        }

        if (title.length + content.length > MAX_NOTE_CHARS) {
            toast.error(`Title and content must total no more than ${MAX_NOTE_CHARS}`);
            return;
        }

        if (guestMode) {
            const now = new Date().toISOString();

            if (noteId === "new") {
                const newNote = {
                    noteId: crypto.randomUUID(),
                    title,
                    content,
                    createdAt: now,
                    updatedAt: now,
                };

                setNotes([...notes, newNote]);
                toast.success("Note created");
                navigate(`/notes/${newNote.noteId}`);
                return;
            }

            if (!noteId) return;

            setNotes(notes.map(note =>
                note.noteId === noteId
                    ? { ...note, title, content, updatedAt: now }
                    : note
            ));

            toast.success("Note updated");
            return;
        }

        if (noteId === "new") {
            if (notes.length >= MAX_NOTES_PER_USER) {
                toast.error(`You can have up to ${MAX_NOTES_PER_USER} notes`);
                return;
            }
            addNewNote(content, title);
        }
        else {
            updateNote(content, title);
        }
    }, [
        addNewNote,
        content, 
        guestMode, 
        navigate, 
        noteId, 
        notes, 
        setNotes, 
        title,
        updateNote
    ]);

    useEffect(() => {
        const handleShortcut = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                handleSaveNote();
            }
        }

        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, [handleSaveNote]);

    const handleDeleteNote = async () => {
        if (!noteId) {
            return;
        }

        setShowDeleteDialog(true);
    }

    const deleteNote = async () => {
        if (!noteId || noteId === "new") return;

        if (guestMode) {
            setNotes(notes.filter(note => note.noteId !== noteId));
            toast.success("Note deleted");
            navigate("/");
            return;
        }

        try {
            const response = await api.delete(`/notes/${noteId}`);
            const data = await response.json();

            if (!response.ok) {
                toast.error(data?.error || "Failed to delete note, please try again");
                return;
            }

            setNotes(notes.filter(note => note.noteId !== noteId));

            toast.success("Note deleted successfully");
            navigate("/");
        }
        catch (err: Error | any) {
            toast.error(err?.message);
            console.log(err);
        }
    }

    const SaveButton = () => {
        return (
            <button
                onClick={handleSaveNote}
                title="save note"
            >
                <SaveIcon />
            </button>
        );
    }

    const DeleteButton = () => {
        return (
            <button
                onClick={handleDeleteNote}
                title="delete note"
            >
                <DeleteIcon />
            </button>
        );
    }

    return (
        <div className="note-editor-page page">
            {showDeleteDialog &&
                <ConfirmDialog
                    title="Delete Note?"
                    message="Press confirm to delete note or cancel to cancel"
                    onConfirm={() => {
                        deleteNote();
                        setShowDeleteDialog(false)
                    }
                    }
                    onCancel={() => setShowDeleteDialog(false)}
                />}

            <h2>Note Editor</h2>
            <div className="note-container">
                <div className="note-editor-btns">
                    {noteId !== "new" && <DeleteButton />}
                    <SaveButton />
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