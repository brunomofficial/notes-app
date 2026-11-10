import { useEffect, useRef } from "react";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = "confirm-dialog-title";
    const messageId = "confirm-dialog-message";

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
    const handleCancel = () => { onCancel(); closeDialog(); };
    const handleConfirm = () => { onConfirm(); closeDialog(); };

    return (
        <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby={titleId} aria-describedby={messageId}>
            <div className="confirm-dialog-content">
                <div className="confirm-dialog-icon" aria-hidden="true">?</div>
                <div>
                    <h2 id={titleId}>{title}</h2>
                    <p id={messageId}>{message}</p>
                </div>
            </div>
            <div className="dialog-actions">
                <button type="button" onClick={handleCancel} className="cancel-dialog-btn">Cancel</button>
                <button type="button" onClick={handleConfirm} className="confirm-dialog-btn" autoFocus>Confirm</button>
            </div>
        </dialog>
    );
}
