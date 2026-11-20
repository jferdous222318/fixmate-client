"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
};

const WIDTH = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export default function Modal({ open, onClose, title, children, size = "md" }: Props) {
    // close on Escape + lock page scroll while open
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
            <button className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
            <div className={`relative max-h-[92vh] w-full ${WIDTH[size]} overflow-y-auto rounded-t-2xl border-2 border-ink bg-paper shadow-hard sm:rounded-2xl`}>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-3.5">
                    <h3 className="text-lg font-extrabold">{title}</h3>
                    <button onClick={onClose} className="rounded-md p-1 hover:bg-paper-dark" aria-label="Close dialog">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}