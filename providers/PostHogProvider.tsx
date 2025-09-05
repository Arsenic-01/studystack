"use client";

import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import React, { useEffect, Suspense, JSX } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Initialize PostHog once on the client
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/api/event",
    capture_pageview: false,
    debug: process.env.NODE_ENV === "development",
  });
}

/**
 * Component to handle capturing pageviews on route changes.
 */
function PostHogPageview(): JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * The main provider component that integrates PostHog with NextAuth and pageview tracking.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Effect to identify the user or reset PostHog based on auth status
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else if (status === "unauthenticated") {
      posthog.reset();
    }
  }, [session, status]);

  return (
    <PHProvider client={posthog}>
      {children}
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
    </PHProvider>
  );
}
