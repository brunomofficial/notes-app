import React, { useEffect, useRef } from "react";
import "./ConfirmDialog.css"

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        dialogRef.current?.showModal();
        return () => dialogRef.current?.close()
    }, []);
    
    const closeDialog = () => dialogRef.current?.close();
    const handleConfirm = () => {
        onConfirm();
        closeDialog();
    }
    const handleCancel = () => {
        onCancel?.();
        closeDialog();
    }

    return(
        <dialog ref={dialogRef} className="confirm-dialog">
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="dialog-actions">
                <button onClick={handleCancel} className="cancel-dialog-btn">Cancel</button>
                <button onClick={handleConfirm} className="confirm-dialog-btn">Confirm</button>
            </div>       
        </dialog>
    );
}