"use client";

import { useEffect } from "react";
import Link from "next/link";
import { House, RotateCcw, Wrench } from "lucide-react";

// Next 16 passes `retry` (re-renders the failed segment)
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const message = error instanceof Error ? error.message : "Unexpected error";

    return (
        <div className="bg-blueprint flex min-h-[70vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg rounded-2xl border-2 border-ink bg-white p-8 text-center shadow-hard">
                <span className="mx-auto flex h-16 w-16 rotate-6 items-center justify-center rounded-xl border-2 border-ink bg-signal text-white shadow-hard-sm">
                    <Wrench size={30} />
                </span>
                <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.25em] text-signal">Something broke</p>
                <h1 className="mt-2 text-3xl font-extrabold">We hit a snag on this page</h1>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    Our technicians have been notified. Try again, or head back home.
                </p>
                <p className="mt-4 rounded-md bg-paper px-3 py-2 font-mono text-xs text-ink-soft">{message}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <button onClick={() => retry()} className="btn-primary"><RotateCcw size={16} /> Try Again</button>
                    <Link href="/" className="btn-ghost"><House size={16} /> Back to Home</Link>
                </div>
            </div>
        </div>
    );
}