"use client";

import * as React from "react";

import {
  LayoutDashboard,
  CalendarPlus,
  PlayCircle,
  CheckCircle2,
  Users,
  Factory,
  Layers,
  Package,
  Settings,
  GalleryVerticalEnd,
  ShieldUser,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { CompanyLogo } from "../common/company-logo";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  navMain: [
    {
      title: "MAIN MENU",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "New Schedule",
          url: "/new-schedule",
          icon: CalendarPlus,
        },
        {
          title: "Schedule List",
          url: "/schedules",
          icon: LayoutDashboard,
        },
        // {
        //   title: "Running Schedules",
        //   url: "/schedules",
        //   icon: PlayCircle,
        // },
        // {
        //   title: "Completed Schedules",
        //   url: "/schedules",
        //   icon: CheckCircle2,
        // },
        {
          title: "PPL List",
          url: "/ppl",
          icon: PlayCircle,
        },
      ],
    },
    {
      title: "ADMINISTRATOR",
      url: "#",
      items: [
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Roles",
          url: "/admin/roles",
          icon: ShieldUser,
        },
        {
          title: "Machines",
          url: "/admin/machines",
          icon: Factory,
        },
        {
          title: "Lines",
          url: "/admin/lines",
          icon: Layers,
        },
        {
          title: "Products",
          url: "/admin/products",
          icon: Package,
        },
        // {
        //   title: "Materials",
        //   url: "#",
        //   icon: Layers,
        // },
        // {
        //   title: "Parts",
        //   url: "#",
        //   icon: Package,
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        //   icon: Settings,
        // },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <CompanyLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
