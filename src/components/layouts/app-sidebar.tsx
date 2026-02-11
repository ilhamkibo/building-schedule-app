"use client";

import * as React from "react";

import {
  LayoutDashboard,
  CalendarPlus,
  PlayCircle,
  Users,
  Factory,
  Layers,
  Package,
  ShieldUser,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useAuthContext } from "@/context/auth-context";
import { NavLogin } from "./nav-login";

type NavItem = {
  subtitle: string;
  url: string;
  icon: React.ElementType;
  items?: { // The '?' makes this optional
    name: string;
    url: string;
    icon?: React.ElementType;
  }[];
};

type NavGroup = {
  title: string;
  data: NavItem[];
};

// This is sample data.
const navMain: NavGroup[] = [
  {
    title: "MAIN MENU",
    data: [
      {
        subtitle: "Main Dashboard",
        url: "/",
        icon: LayoutDashboard,
        // items: [
        //   {
        //     name: "Dashboard",
        //     url: "/dashboard",
        //     icon: LayoutDashboard,
        //   },
        //   {
        //     name: "PCR 1",
        //     url: "/pcr-1",
        //     icon: LayoutDashboard,
        //   },
        // ],
      },
      {
        subtitle: "New Schedule",
        url: "/new-schedule",
        icon: CalendarPlus,
      },
      {
        subtitle: "Schedule List",
        url: "/schedules",
        icon: LayoutDashboard,
      },
      {
        subtitle: "PPL List",
        url: "/ppl",
        icon: PlayCircle,
      },
    ]
  },
  {
    title: "ADMINISTRATOR",
    data: [
      {
        subtitle: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        subtitle: "Roles",
        url: "/admin/roles",
        icon: ShieldUser,
      },
      {
        subtitle: "Machines",
        url: "/admin/machines",
        icon: Factory,
      },
      {
        subtitle: "Lines",
        url: "/admin/lines",
        icon: Layers,
      },
      {
        subtitle: "Products",
        url: "/admin/products",
        icon: Package,
      },
    ]
  }
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  console.log("🚀 ~ AppSidebar ~ user:", user)

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <CompanyLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {navMain.map((item, index) => (
            <div key={item.title} className={index === 0 ? "" : "mt-4"}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarMenu>
                {item.data.map((menu) => {
                  const hasChildren = menu.items && menu.items.length > 0;

                  if (hasChildren) {
                    return (
                      <Collapsible
                        key={menu.subtitle}
                        asChild
                        defaultOpen={menu.items?.some(i => pathname === i.url)}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={menu.subtitle}>
                              {menu.icon && <menu.icon />}
                              <span>{menu.subtitle}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {menu.items?.map((sub) => (
                                <SidebarMenuSubItem key={sub.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === sub.url}
                                  >
                                    <a href={sub.url}>
                                      {/* {sub.icon && <sub.icon />} */}
                                      <span>{sub.name}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  // =====================
                  // WITHOUT COLLAPSIBLE
                  // =====================
                  return (
                    <SidebarMenuItem key={menu.subtitle}>
                      <SidebarMenuButton asChild isActive={pathname === menu.url}>
                        <a href={menu.url}>
                          {menu.icon && <menu.icon />}
                          <span>{menu.subtitle}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} logout={logout} />}
        {!user && <NavLogin />}
      </SidebarFooter>
    </Sidebar>
  );
}
