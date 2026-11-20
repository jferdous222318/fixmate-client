import { Cog, LoaderCircle } from "lucide-react";

export default function Spinner({ size = 20, className = "" }: { size?: number; className?: string }) {
    return <LoaderCircle size={size} className={`animate-spin ${className}`} aria-label="Loading" />;
}

// full-area loader with two meshing gears, used by loading.tsx files
export function PageLoader({ label = "Loading" }: { label?: string }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status">
            <div className="relative h-16 w-20" aria-hidden="true">
                <Cog size={46} className="absolute left-0 top-0 animate-[spin_2.4s_linear_infinite] text-workshop" />
                <Cog size={32} className="absolute bottom-0 right-0 animate-[spin_1.6s_linear_infinite_reverse] text-signal" />
            </div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">{label}…</p>
        </div>
    );
}