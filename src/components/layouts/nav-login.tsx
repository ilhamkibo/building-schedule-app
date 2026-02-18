import React from "react"
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavLogin() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link
                        href="/login"
                        className={cn(
                            "group flex w-full items-center justify-center gap-2",
                            "rounded-lg bg-primary text-primary-foreground",
                            "hover:bg-primary/90",
                            "transition-all duration-200",
                            "py-2 font-semibold"
                        )}

                    >
                        <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span>Login</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
