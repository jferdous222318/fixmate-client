import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
    return (
        <Link href="/" className="flex items-center gap-2.5" aria-label="FixMate home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-signal text-white shadow-hard-sm">
                <Wrench size={18} strokeWidth={2.6} />
            </span>
            <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-paper" : "text-ink"}`}>
                Fix<span className="text-signal">Mate</span>
            </span>
        </Link>
    );
}