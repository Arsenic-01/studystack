// app/PostHogProvider.tsx
"use client";

import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import React, { JSX, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Initialize PostHog once on the client
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/api/event",
    // Set capture_pageview to false to prevent PostHog from automatically capturing page views
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
    // Wait until the session is loaded
    if (status === "authenticated" && session?.user) {
      console.log("Identifying user to PostHog:", session.user);

      // Identify the user to PostHog with their unique ID and properties
      posthog.identify(
        session.user.id, // Your user's unique ID
        {
          // Add any user properties you want to track
          email: session.user.email,
          name: session.user.name,
          // Note: Add custom properties to your NextAuth session type for type safety
          // role: session.user.role,
          // prnNo: session.user.prnNo,
        }
      );
    } else if (status === "unauthenticated") {
      // Reset PostHog on logout to clear user data
      posthog.reset();
    }
  }, [session, status]);

  // Wrap the app in the PostHogProvider and include our pageview tracker
  return (
    <PHProvider client={posthog}>
      <PostHogPageview />
      {children}
    </PHProvider>
  );
}
