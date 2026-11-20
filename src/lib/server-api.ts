import "server-only";

// Server-side fetch for PUBLIC data (home page, browse services, details).
// Returns null instead of throwing, so a slow API never crashes the page.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function getPublic<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}