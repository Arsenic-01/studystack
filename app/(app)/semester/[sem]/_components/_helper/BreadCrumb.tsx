"use client";
import { ChevronDown, Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function BreadcrumbWithDropdown({ sem }: { sem: string }) {
  const router = useRouter();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              Semester
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {dropdownItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Semester {sem}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const dropdownItems = [
  {
    label: "Semester 1",
    href: "/semester/1",
  },
  {
    label: "Semester 2",
    href: "/semester/2",
  },
  {
    label: "Semester 3",
    href: "/semester/3",
  },
  {
    label: "Semester 4",
    href: "/semester/4",
  },
  {
    label: "Semester 5",
    href: "/semester/5",
  },
  {
    label: "Semester 6",
    href: "/semester/6",
  },
];
