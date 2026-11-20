import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast first check: no session cookie on a private route -> /sign-in?redirect=<page>.
// The real session + role check happens on the server in each dashboard layout.
export function proxy(request: NextRequest) {
    if (getSessionCookie(request)) return NextResponse.next();

    const { pathname, search } = request.nextUrl;
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/dashboard/:path*", "/payment/:path*"],
};