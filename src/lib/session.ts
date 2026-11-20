import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { Role } from "./types";

// Reads the BetterAuth session on the server (works on reload, so a logged-in
// user is never bounced to /sign-in when refreshing a private route).
export async function getSession() {
    return auth.api.getSession({ headers: await headers() });
}

export const roleOf = (user: { role?: string | null }): Role =>
    user.role === "admin" || user.role === "technician" ? user.role : "customer";

// Guard for role dashboards: logged out -> /sign-in, wrong role -> own dashboard
export async function requireRole(role: Role) {
    const session = await getSession();
    if (!session) redirect("/sign-in");
    const current = roleOf(session.user);
    if (current !== role) redirect(`/dashboard/${current}?forbidden=1`);
    return session;
}

// only allow internal paths as a redirect target (blocks //evil.com)
export const safeRedirect = (target?: string | string[]) =>
    typeof target === "string" && target.startsWith("/") && !target.startsWith("//") ? target : null;