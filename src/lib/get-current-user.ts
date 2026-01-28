import "server-only";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { AuthUser } from "@/types/user";

export async function getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;

    const decoded = decodeJwt(token);

    return {
        name: decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] as string,
        username: decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] as string,
        role: decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] as string,
    };
}
