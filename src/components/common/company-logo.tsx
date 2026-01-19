"use client";

import Image from "next/image";
import Link from "next/link";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

export function CompanyLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/" className="flex items-center gap-3 px-3 py-2">
          <Image
            src="/images/dunlop-logo.jpg"
            alt="Sumi Rubber Indonesia Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">Sumi Rubber Indonesia</span>
            <span className="text-xs text-muted-foreground">OEE Dashboard</span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
