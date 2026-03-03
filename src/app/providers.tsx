"use client";
import { ThemeProvider } from "@/providers/theme-provider";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth-context";
import { getValidatedUser } from "@/lib/auth-validator";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <TooltipProvider>
            <Toaster position="top-right" />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
