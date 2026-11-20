"use client";

import { CircleExclamationPoint } from "lucide-react";
import Modal from "./Modal";
import Spinner from "./Spinner";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmModal({
    open, title, message, confirmLabel = "Confirm", danger = true, loading, onConfirm, onClose,
}: Props) {
    return (
        <Modal open={open} onClose={loading ? () => { } : onClose} title={title} size="sm">
            <div className="flex gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-ink ${danger ? "bg-red-100 text-red-700" : "bg-mustard text-ink"}`}>
                    <CircleExclamationPoint size={22} />
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{message}</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button className="btn-ghost" onClick={onClose} disabled={loading}>Keep it</button>
                <button
                    className={danger ? "btn bg-red-600 text-white" : "btn-primary"}
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading && <Spinner size={16} />} {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}