"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { LoginRequest, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";
import { ApiError } from "../types/api-response";
import { useAuthContext } from "@/context/auth-context";

export function useAuth() {
    const router = useRouter();
    const { user, setUser } = useAuthContext();

    const loginMutation = useMutation<
        LoginResponse,
        AxiosError<ApiError>,
        LoginRequest
    >({
        mutationFn: (payload) => authService.login(payload),

        onSuccess: (res) => {
            const token =
                typeof res.data.accessToken === "string"
                    ? res.data.accessToken
                    : res.data.accessToken.token;

            // CLIENT COOKIE (non-HttpOnly)
            Cookies.set("access_token", token, {
                path: "/",
                sameSite: "Lax",
                secure: process.env.NODE_ENV === "production",
            });

            setUser(res.data.user);

            toast.success("Login berhasil");

            // Redirect based on callbackUrl or default to dashboard
            // Use window.location.href for a full reload so the auth state
            // (cookie + context) is consistently picked up by all layouts/guards.
            const params = new URLSearchParams(window.location.search);
            const callbackUrl = params.get("callbackUrl") || process.env.NEXT_PUBLIC_BASE_PATH || "/";
            window.location.href = callbackUrl;
        },
        onError: (err) => {
            toast.error(
                err.message ?? "Login gagal"
            );
        },
    });

    const logout = () => {
        Cookies.remove("access_token");
        toast.success("Logout berhasil");
        router.replace("/");
    };

    return {
        user,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout,
    };
}
