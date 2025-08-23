"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { UserProvider } from "@/hooks/useUser";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <UserProvider>
        <HeroUIProvider>
          <NextThemesProvider attribute="class" enableSystem>
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
      </UserProvider>
    </NextAuthSessionProvider>
  );
}
