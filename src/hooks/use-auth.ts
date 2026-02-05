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
            router.replace("/dashboard");
        },

        onError: (err) => {
            console.log("🚀 ~ useAuth ~ err:", err)
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
