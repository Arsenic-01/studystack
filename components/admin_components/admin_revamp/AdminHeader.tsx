"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/core/navbar/navbar_helper_components/ThemeSwitcher";
import ProfileCard from "@/components/core/navbar/navbar_helper_components/ProfileCard";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DynamicBreadcrumb />
      </div>

      {/* Right side - Theme toggle and Profile */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileCard />
      </div>
    </header>
  );
}
