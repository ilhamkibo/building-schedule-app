import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const response = NextResponse.next();

    const token = req.cookies.get("access_token")?.value;
    let isAuthenticated = false;
    let user = null;

    if (token) {
        try {
            const decodedToken = decodeJwt(token);
            user = {
                id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                name: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            }

            const now = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp > now) {
                isAuthenticated = true;
            } else {
                // token expired → hapus cookie
                response.cookies.delete("access_token");
            }
        } catch (err) {
            // token invalid / corrupt
            response.cookies.delete("access_token");
        }
    }

    /**
     * PUBLIC ROOT (/)
     * - kalau sudah login → redirect ke dashboard
     */
    if (pathname === "/login") {
        if (isAuthenticated) {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
            return NextResponse.redirect(new URL(`${basePath}/`, req.url));
        }
        return response;
    }

    /**
     * PROTECTED ADMIN ROUTES
     */
    // Membiarkan / bisa diakses tanpa login (Dashboard public)
    if (pathname !== "/") {
        if (!isAuthenticated) {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
            const loginURL = new URL(`${basePath}/login`, req.url);
            loginURL.searchParams.set("callbackUrl", `${basePath}${pathname}`);
            return NextResponse.redirect(loginURL);
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};