import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { LogIn } from 'lucide-react'

export function NavLogin() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <a href="/login">
                        <LogIn />
                        <span>Login</span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}