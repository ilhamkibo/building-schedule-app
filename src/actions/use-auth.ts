"use server";

import { cookies } from "next/headers";
import { authService } from "@/services/auth-service";
import { loginSchema } from "@/validators/login-validator";

export async function login(
    _: any,
    formData: FormData
) {
    try {
        const raw = {
            username: formData.get("username"),
            password: formData.get("password"),
        };

        const parsed = loginSchema.safeParse(raw);

        if (!parsed.success) {
            return {
                success: false,
                message: parsed.error.issues[0].message,
            };
        }

        const { username, password } = parsed.data;

        const res = await authService.login({ username, password });

        const { user, accessToken } = res.data;

        const cookieStore = await cookies();

        cookieStore.set("access_token", accessToken.token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            expires: new Date(accessToken.expiredAt),
        });

        return {
            success: true,
            user,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message ?? "Login gagal",
        };
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("access_token");

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            message: "Logout gagal",
        };
    }
}

