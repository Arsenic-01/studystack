// app/admin/layout.tsx
import { AdminHeader } from "@/components/admin_components/admin_revamp/AdminHeader";
import { AdminSidebar } from "@/components/admin_components/sidebar/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
