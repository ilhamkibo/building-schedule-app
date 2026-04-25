"use client";

import { AuthUser } from "@/types/user";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: AuthUser | null;
}) {
    const [user, setUser] = useState<AuthUser | null>(initialUser);

    const logout = () => {
        import("js-cookie").then(({ default: Cookies }) => {
            Cookies.remove("access_token");
            setUser(null);
            window.location.href = process.env.NEXT_PUBLIC_BASE_PATH || "/";
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
