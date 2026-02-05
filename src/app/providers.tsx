"use client";
import { ThemeProvider } from "@/providers/theme-provider";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";
import { getValidatedUser } from "@/lib/auth-validator";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false
        }
      }
    })
  )

  const validatedUser = getValidatedUser();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={validatedUser}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
