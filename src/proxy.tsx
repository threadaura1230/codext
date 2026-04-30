import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
    const secret = process.env.ADMIN_SECRET_PATH;
    const pathname = request.nextUrl.pathname;

    // ── Block any /admin path with a wrong or missing secret slug ──────────
    // Rewrites to /not-found so the response is indistinguishable from a real 404.
    // Prevents slug enumeration without leaking route existence.
    const cleanSecret = secret?.replace(/\/$/, "");
    console.log(`[Proxy] Path: ${pathname}, Secret: ${secret}, Clean: ${cleanSecret}`);

    if (pathname.startsWith("/admin")) {
        if (!cleanSecret || !pathname.includes(`/${cleanSecret}`)) {
            console.log(`[Proxy] Blocked: Secret mismatch`);
            return NextResponse.rewrite(new URL("/not-found", request.url));
        }

        const token = request.cookies.get("codext_admin_token")?.value;
        const loginPath = `/admin/${cleanSecret}/login`;
        const isLoginPage = pathname === loginPath;

        if (isLoginPage) {
            // ── Already authenticated -> skip login page entirely ─────────────
            if (token && verifyToken(token)) {
                return NextResponse.redirect(
                    new URL(`/admin/${cleanSecret}/dashboard`, request.url)
                );
            }
            // Not authenticated -> render login page normally
            return NextResponse.next();
        }

        // ── All other /admin routes require a valid token ─────────────────────
        if (!token || !verifyToken(token)) {
            return NextResponse.redirect(new URL(loginPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // api routes are intentionally excluded as they handle auth themselves
    matcher: ["/admin/:path*"],
};