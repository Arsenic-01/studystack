// app/PostHogProvider.tsx
"use client";

import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

// Initialize PostHog once on the client
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/api/event",
    capture_pageview: true,
    debug: process.env.NODE_ENV === "development",
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Wait until the session is loaded
    if (status === "authenticated" && session?.user) {
      console.log("Identifying user to PostHog:", session.user);

      // Identify the user to PostHog
      posthog.identify(
        session.user.id, // Unique user ID
        {
          // User properties
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          prnNo: session.user.prnNo,
        }
      );
    } else if (status === "unauthenticated") {
      // Reset PostHog on logout
      posthog.reset();
    }
  }, [session, status]);

  // Wrap the app in the PostHogProvider
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
