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
  ShieldAlert,
  ChevronRight,
  Clock,
  Tags,
  CalendarCheck,
  Activity,
  Settings,
  Palette,
  Ruler,
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
import Link from "next/link";

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
      },
      {
        subtitle: "Schedules",
        url: "/schedules",
        icon: CalendarCheck,
        items: [
          {
            name: "Schedule List",
            url: "/schedules",
            icon: CalendarCheck,
          },
          {
            name: "Adjust Schedule",
            url: "/schedules/adjust",
            icon: CalendarCheck,
          },
        ],
      },
      {
        subtitle: "PPL List",
        url: "/ppl",
        icon: PlayCircle,
      },
      {
        subtitle: "PPC List",
        url: "/ppc",
        icon: Package,
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
        subtitle: "Categories",
        url: "/admin/categories",
        icon: Tags,
      },
      {
        subtitle: "Products",
        url: "/admin/products",
        icon: Package,
      },
      // {
      //   subtitle: "Product Restrictions",
      //   url: "/admin/product-restrictions",
      //   icon: ShieldAlert,
      // },
      {
        subtitle: "Shift Time",
        url: "/admin/shifts",
        icon: Clock,
      },
      {
        subtitle: "Curing Efficiencies",
        url: "/admin/curing-efficiencies",
        icon: Activity,
      },
      {
        subtitle: "Configurations",
        url: "/admin/config",
        icon: Settings,
      },
      {
        subtitle: "Size Colors",
        url: "/admin/schedule-size-colors",
        icon: Palette,
      },
      {
        subtitle: "Size Types",
        url: "/admin/schedule-size-types",
        icon: Ruler,
      },
    ]
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const filteredNavMain = React.useMemo(() => {
    // kalau belum login → treat sebagai viewer
    const role = user?.role?.toLowerCase() ?? "viewer";

    return navMain
      .map((group) => {
        const filteredData = group.data.filter((item) => {
          // Admin bisa lihat semua
          if (role === "admin") return true;

          // Creator
          if (role === "creator") {
            const allowedPaths = ["/", "/ppl", "/schedules"];
            return allowedPaths.includes(item.url);
          }

          // Viewer (default termasuk belum login)
          if (role === "viewer") {
            return item.url === "/";
          }

          return false;
        });

        return {
          ...group,
          data: filteredData,
        };
      })
      .filter((group) => group.data.length > 0);
  }, [user]);

  const isActiveRoute = (url: string) => {
    if (pathname === url) return true;

    // hanya aktif sebagai parent kalau bukan route child yang lebih spesifik
    if (
      pathname.startsWith(url + "/") &&
      !navMain.some(group =>
        group.data.some(item =>
          item.items?.some(sub => sub.url === pathname)
        )
      )
    ) {
      return true;
    }

    return false;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <CompanyLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {filteredNavMain.map((item, index) => (
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
                                    isActive={isActiveRoute(sub.url)}                                  >
                                    <Link href={sub.url}>
                                      {/* {sub.icon && <sub.icon />} */}
                                      <span>{sub.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  return (
                    <SidebarMenuItem key={menu.subtitle}>
                      <SidebarMenuButton asChild isActive={isActiveRoute(menu.url)}>
                        <Link href={menu.url}>
                          {menu.icon && <menu.icon />}
                          <span>{menu.subtitle}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-3">
        {user && <NavUser user={user} logout={logout} />}
        {!user && <NavLogin />}
      </SidebarFooter>
    </Sidebar>
  );
}
