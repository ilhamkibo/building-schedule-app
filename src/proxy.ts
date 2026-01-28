import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        const url = new URL(req.url);
        if (url.pathname !== "/") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (token) {
        const url = new URL(req.url);
        if (url.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};