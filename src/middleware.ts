import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const auth = request.cookies.get("auth");

    const protectedRoutes = ['/create'];

    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!auth) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set("message", "login_required");
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/create/:path*', '/admin/:path*',],
};