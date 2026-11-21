// Server-side fetch for PUBLIC data (home page, browse services, details).
// Returns null instead of throwing, so a slow API never crashes the page.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function getPublic<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000), // give up after 8s instead of hanging
        });
        if (!res.ok) {
            console.error(`[getPublic] ${API_URL}${path} -> HTTP ${res.status}`);
            return null;
        }
        return (await res.json()) as T;
    } catch (err) {
        console.error(`[getPublic] ${API_URL}${path} failed:`, err);
        return null;
    }
}