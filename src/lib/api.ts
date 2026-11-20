// Client-side helper for calling the Express API.
// Private routes need a JWT: we get it from our own Next.js route (/api/token),
// which signs it only when the BetterAuth session is valid.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

let cached: { token: string; expiresAt: number } | null = null;

// call this on sign in / sign out so a new user never reuses an old token
export function clearToken() {
    cached = null;
}

async function getToken(): Promise<string> {
    if (cached && cached.expiresAt > Date.now()) return cached.token;
    const res = await fetch("/api/token", { cache: "no-store" });
    if (!res.ok) throw new ApiError("Please sign in again", 401);
    const { token } = await res.json();
    cached = { token, expiresAt: Date.now() + 50 * 60 * 1000 }; // token lives 1h, refresh at 50m
    return token;
}

type Options = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
};

export async function api<T = unknown>(path: string, { method = "GET", body, auth = true }: Options = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = `Bearer ${await getToken()}`;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        if (res.status === 401) clearToken();
        throw new ApiError(data?.message || "Something went wrong", res.status);
    }
    return data as T;
}

// pulls a readable message out of anything that was thrown
export const errorMessage = (err: unknown) =>
    err instanceof Error ? err.message : "Something went wrong";