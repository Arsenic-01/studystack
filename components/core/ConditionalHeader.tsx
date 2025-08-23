"use client";

import { usePathname } from "next/navigation";
import Header from "./navbar/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}
