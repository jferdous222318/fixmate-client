"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, RotateCcw } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

// File input -> our /api/upload route -> ImgBB. Calls onChange with the hosted URL.
export async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Image upload failed");
    return data.url as string;
}

type Props = {
    value: string;
    onChange: (url: string) => void;
    onUploading?: (v: boolean) => void;
    shape?: "banner" | "avatar";
    error?: string;
};

export default function ImageUpload({ value, onChange, onUploading, shape = "banner", error }: Props) {
    const input = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
        if (file.size > 5 * 1024 * 1024) return toast.error("Image must be 5 MB or smaller");

        setLoading(true);
        onUploading?.(true);
        try {
            onChange(await uploadImage(file));
            toast.success("Image uploaded");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setLoading(false);
            onUploading?.(false);
        }
    };

    const avatar = shape === "avatar";

    return (
        <div>
            <input ref={input} type="file" accept="image/*" className="hidden" onChange={pick} />
            <button
                type="button"
                onClick={() => input.current?.click()}
                disabled={loading}
                className={
                    avatar
                        ? "group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink bg-paper-dark"
                        : "group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-ink bg-paper-dark"
                }
            >
                {value && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={value} alt="Selected" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className={`relative z-10 flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${value ? "bg-white/90 opacity-0 shadow-hard-sm transition group-hover:opacity-100" : ""}`}>
                    {loading ? <Spinner size={22} /> : value ? <RotateCcw size={20} /> : <ImagePlus size={24} />}
                    {loading ? "Uploading…" : value ? "Change" : avatar ? "Upload" : "Click to upload image (max 5 MB)"}
                </span>
            </button>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}