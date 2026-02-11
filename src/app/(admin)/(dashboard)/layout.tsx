import AppHeader from "@/components/layouts/app-header";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader title="Dashboard" />
      <main>{children}</main>
    </div>
  );
}
