import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { type Note } from "../../models/note";
import { useApp } from "../../context/AppContext";
import { api } from "../../utils/api";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./NotePreview.css";

export default function NotePreview({ note }: { note: Note }) {
    const navigate = useNavigate();
    const { notes, setNotes, guestMode } = useApp();
    const noteId = note.noteId;
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!copied) return;

        const timeoutId = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timeoutId);
    }, [copied]);

    useEffect(() => {
        if (!menuPosition) return;

        const closeMenu = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setMenuPosition(null);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuPosition(null);
        };

        document.addEventListener("pointerdown", closeMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", closeMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuPosition]);

    const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const menuWidth = 180;
        const menuHeight = 96;
        const x = Math.min(event.clientX, window.innerWidth - menuWidth - 8);
        const y = Math.min(event.clientY, window.innerHeight - menuHeight - 8);

        setMenuPosition({ x: Math.max(8, x), y: Math.max(8, y) });
    };

    const exportNote = () => {
        const noteFile = new Blob([JSON.stringify(note, null, 2)], {
            type: "application/json",
        });
        const downloadUrl = URL.createObjectURL(noteFile);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `note-${note.noteId}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
        setMenuPosition(null);
        toast.success("Note exported");
    };

    const copyNote = async () => {
        if (!navigator.clipboard?.writeText) {
            toast.error("Failed to copy note");
            return;
        }

        const text = note.title ? `${note.title}\n${note.content}` : note.content;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            toast.error("Error copying note");
        }
    };

    const deleteNote = async () => {
        if (guestMode) {
            setNotes(notes.filter((currentNote) => currentNote.noteId !== noteId));
            toast.success("Note deleted");
            setShowDeleteDialog(false);
            return;
        }

        try {
            const response = await api.delete(`/notes/${noteId}`);
            const data = await response.json() as { error?: string };

            if (!response.ok) {
                toast.error(data.error || "Failed to delete note");
                return;
            }

            setNotes(notes.filter((currentNote) => currentNote.noteId !== noteId));
            toast.success("Note deleted successfully");
            setShowDeleteDialog(false);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete note");
        }
    };

    return (
        <div
            className={`note-preview${menuPosition ? " note-preview-context-open" : ""}`}
            onClick={() => navigate(`/notes/${noteId}`)}
            onContextMenu={handleContextMenu}
        >
            <span className="note-preview-title">{note?.title}</span>
            <span className="note-preview-content">{note.content}</span>

            {menuPosition && createPortal(
                <div
                    ref={menuRef}
                    className="note-context-menu"
                    style={{ left: menuPosition.x, top: menuPosition.y }}
                    role="menu"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button type="button" role="menuitem" onClick={exportNote}>
                        Export note
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className={`note-context-copy${copied ? " copied" : ""}`}
                        aria-label={copied ? "Copied" : "Copy note"}
                        onClick={copyNote}
                    >
                        <span className="note-copy-label" aria-hidden="true">
                            <span className={`note-copy-label-default${copied ? " is-hidden" : ""}`}>
                                Copy note
                            </span>
                            <span className={`note-copy-label-success${copied ? " is-visible" : ""}`}>
                                Copied
                            </span>
                        </span>
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        className="note-context-delete"
                        onClick={() => {
                            setMenuPosition(null);
                            setShowDeleteDialog(true);
                        }}
                    >
                        Delete note
                    </button>
                </div>,
                document.body,
            )}

            {showDeleteDialog && (
                <ConfirmDialog
                    title="Delete note?"
                    message="This will permanently delete this note."
                    onConfirm={() => {
                        setShowDeleteDialog(false);
                        void deleteNote();
                    }}
                    onCancel={() => setShowDeleteDialog(false)}
                />
            )}
        </div>
    );
}
