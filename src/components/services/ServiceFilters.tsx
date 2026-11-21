"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import clsx from "clsx";
import { CATEGORIES, CATEGORY_META, SERVICE_MODES, SORT_OPTIONS } from "@/lib/constants";
import Spinner from "@/components/ui/Spinner";

// All filters live in the URL, so they survive a reload and can be shared.
// The page reads them on the server and passes them to MongoDB.
export default function ServiceFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [pending, startTransition] = useTransition();

    const urlSearch = params.get("search") ?? "";
    const [search, setSearch] = useState(urlSearch);
    const [syncedSearch, setSyncedSearch] = useState(urlSearch);

    // keep the input in sync when the user uses back / forward
    if (syncedSearch !== urlSearch) {
        setSyncedSearch(urlSearch);
        setSearch(urlSearch);
    }

    const update = (changes: Record<string, string>) => {
        const next = new URLSearchParams(params.toString());
        Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        next.delete("page"); // any filter change starts again from page 1
        startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
    };

    const category = params.get("category") ?? "";
    const mode = params.get("mode") ?? "";
    const sort = params.get("sort") ?? "newest";
    const hasFilters = !!(params.get("search") || category || mode || sort !== "newest");

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border-2 border-ink bg-white p-3 shadow-hard-sm lg:flex-row lg:items-center">
                <form
                    className="flex flex-1 items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        update({ search: search.trim() });
                    }}
                >
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or category, e.g. screen, AC…"
                            className="input border-ink/30 pl-10"
                            aria-label="Search services"
                        />
                    </div>
                    <button type="submit" className="btn-primary shrink-0">
                        {pending ? <Spinner size={16} /> : <Search size={16} />} <span className="hidden sm:inline">Search</span>
                    </button>
                </form>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                    <select aria-label="Service mode" className="input border-ink/30 sm:w-40" value={mode} onChange={(e) => update({ mode: e.target.value })}>
                        <option value="">Any mode</option>
                        {SERVICE_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select aria-label="Sort by" className="input border-ink/30 sm:w-48" value={sort} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}>
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>

            {/* category chips */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => update({ category: "" })}
                    className={clsx("rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition", !category ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white hover:border-ink")}
                >
                    All
                </button>
                {CATEGORIES.map((c) => {
                    const Icon = CATEGORY_META[c].icon;
                    return (
                        <button
                            key={c}
                            onClick={() => update({ category: category === c ? "" : c })}
                            className={clsx(
                                "inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition",
                                category === c ? "border-ink bg-ink text-paper" : "border-ink/25 bg-white hover:border-ink"
                            )}
                        >
                            <Icon size={14} /> {c}
                        </button>
                    );
                })}
                {hasFilters && (
                    <button onClick={() => { setSearch(""); startTransition(() => router.push(pathname)); }} className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-signal hover:underline">
                        <RotateCcw size={14} /> Clear all
                    </button>
                )}
            </div>
        </div>
    );
}