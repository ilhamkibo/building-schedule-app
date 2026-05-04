import React from "react"
import Link from "next/link"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavLogin() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className={cn(
                        "group flex w-full items-center justify-center gap-2",
                        "rounded-lg bg-primary text-primary-foreground",
                        "hover:bg-primary/80", "hover:text-primary-foreground",
                        "dark:bg-primary", "dark:text-primary-foreground",
                        "dark:hover:bg-primary/80", "dark:hover:text-primary-foreground",
                        "transition-all duration-200",
                        "py-2 font-semibold"
                    )}
                >
                    <Link href="/login">
                        <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span>Login</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
