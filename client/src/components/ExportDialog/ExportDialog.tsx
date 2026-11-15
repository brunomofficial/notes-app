import { useEffect, useRef, useState } from "react";
import "./ExportDialog.css";

export type ExportFormat = "json" | "txt";

interface ExportDialogProps {
    onConfirm: (format: ExportFormat) => void;
    onCancel: () => void;
}

export default function ExportDialog({ onConfirm, onCancel }: ExportDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [format, setFormat] = useState<ExportFormat>("json");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        dialog.showModal();
        const handleCancel = (event: Event) => {
            event.preventDefault();
            onCancel();
        };
        dialog.addEventListener("cancel", handleCancel);

        return () => {
            dialog.removeEventListener("cancel", handleCancel);
            if (dialog.open) dialog.close();
        };
    }, [onCancel]);

    const closeDialog = () => dialogRef.current?.close();
    const handleCancel = () => {
        onCancel();
        closeDialog();
    };
    const handleConfirm = () => {
        onConfirm(format);
        closeDialog();
    };

    return (
        <dialog ref={dialogRef} className="export-dialog">
            <div className="export-dialog-content">
                <h2>Export note?</h2>
                <p>Choose a format for the note export.</p>

                <label htmlFor="export-format">Format</label>
                <select
                    id="export-format"
                    value={format}
                    onChange={(event) => setFormat(event.target.value as ExportFormat)}
                >
                    <option value="json">JSON (preserves note data)</option>
                    <option value="txt">Plain text (.txt)</option>
                </select>
            </div>

            <div className="export-dialog-actions">
                <button type="button" onClick={handleCancel} className="cancel-dialog-btn">
                    Cancel
                </button>
                <button type="button" onClick={handleConfirm} className="confirm-dialog-btn" autoFocus>
                    Export
                </button>
            </div>
        </dialog>
    );
}
