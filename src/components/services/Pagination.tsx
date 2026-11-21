import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Server-side pagination: each link keeps the current search / filter / sort
export default function Pagination({
    page, pages, params,
}: { page: number; pages: number; params: Record<string, string | undefined> }) {
    if (pages <= 1) return null;

    const href = (p: number) => {
        const q = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => v && k !== "page" && q.set(k, v));
        if (p > 1) q.set("page", String(p));
        const s = q.toString();
        return `/services${s ? `?${s}` : ""}`;
    };

    const base = "flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-3 text-sm font-bold transition";

    return (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 ? (
                <Link href={href(page - 1)} className={`${base} border-ink bg-white hover:bg-paper-dark`}><ChevronLeft size={16} /> Previous</Link>
            ) : (
                <span className={`${base} cursor-not-allowed border-ink/20 text-ink/30`}><ChevronLeft size={16} /> Previous</span>
            )}

            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                    key={p}
                    href={href(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={clsx(base, p === page ? "border-ink bg-ink text-paper shadow-hard-sm" : "border-ink/30 bg-white hover:border-ink")}
                >
                    {p}
                </Link>
            ))}

            {page < pages ? (
                <Link href={href(page + 1)} className={`${base} border-ink bg-white hover:bg-paper-dark`}>Next <ChevronRight size={16} /></Link>
            ) : (
                <span className={`${base} cursor-not-allowed border-ink/20 text-ink/30`}>Next <ChevronRight size={16} /></span>
            )}
        </nav>
    );
}