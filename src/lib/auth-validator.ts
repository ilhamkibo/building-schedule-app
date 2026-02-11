import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { AuthUser } from "@/types/user";

export function getValidatedUser(): AuthUser | null {
    const token = Cookies.get("access_token");
    if (!token) return null;

    try {
        const decoded = decodeJwt(token);

        // cek expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            Cookies.remove("access_token");
            return null;
        }

        const user: AuthUser = {
            username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string,
            name: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string,
            role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string,
        }

        return user;

    } catch {
        Cookies.remove("access_token");
        return null;
    }
}
