import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import { useEffect } from "react";
import { api } from "../../utils/api";
import SaveIcon from "../../assets/icons/SaveIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./NoteEditor.css";

export default function NoteEditor() {
    const navigate = useNavigate();
    const { noteId } = useParams<{noteId: string}>();

    const { notes, setNotes } = useApp();
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

    const handleSaveNote = () => {
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
        try {
            const response = await api.post("/notes", { title, content });
            const data = await response.json();

            if (!response.ok) {
                toast.error("Failed to create note, please try again");
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

            console.log(data);
        }
        catch (err: Error | any) {
            console.error(err);
            toast.error(err?.message);
        }
    }

    const updateNote = async (content: string, title?: string, ) => {
        try {
            const response = await api.put(`/notes/${noteId}`, { title, content });
            const data = await response.json();
            
            if (!response.ok || !data.note) {
                toast.error("Failed to update note");
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
    }

    const handleDeleteNote = async () => {
        if (!noteId) {
            return;
        }

        setShowDeleteDialog(true);
    }

    const deleteNote = async () => {
        if (!noteId || noteId === "new") return;

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