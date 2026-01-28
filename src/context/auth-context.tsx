"use client";

import { AuthUser } from "@/types/user";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
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

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
