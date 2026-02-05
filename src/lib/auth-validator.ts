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

        return decoded as AuthUser;

    } catch {
        Cookies.remove("access_token");
        return null;
    }
}
