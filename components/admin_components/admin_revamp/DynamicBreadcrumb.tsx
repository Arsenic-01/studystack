// components/admin/DynamicBreadcrumb.tsx
"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pageMap = {
  "/admin": "Overview",
  "/admin/users": "Users Management",
  "/admin/notes": "Notes Management",
  "/admin/links": "Links Management",
  "/admin/subjects": "Subjects Management",
  "/admin/register": "Register User",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const currentPage = pageMap[pathname as keyof typeof pageMap] || "Admin";
  const isHomePage = pathname === "/admin";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          {isHomePage ? (
            <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/admin">Admin Dashboard</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isHomePage && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
