"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" enableSystem>
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </NextAuthSessionProvider>
  );
}
