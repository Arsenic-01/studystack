"use client";

import { useEffect } from "react";
import useHeartbeatQuery from "@/hooks/useHeartbeatQuery";
import { useAuthStore } from "@/store/authStore";

const Heartbeat = ({ userId }: { userId: string }) => {
  const { setUser } = useAuthStore();

  // Initialize the heartbeat query but disable automatic refetching
  const { refetch } = useHeartbeatQuery(userId, {
    enabled: false, // Disable automatic fetching
  });

  useEffect(() => {
    let isMounted = true;

    const verifyAndStartSession = async () => {
      try {
        // 1. First verify the current session
        const sessionResponse = await fetch("/api/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          throw new Error("Session invalid");
        }

        const sessionData = await sessionResponse.json();

        // 2. If we get valid user data, set it and start heartbeat
        if (sessionData.user) {
          if (isMounted) {
            setUser(sessionData.user);
            // Manually trigger the first heartbeat
            await refetch();
          }
        } else {
          throw new Error("No user found in session");
        }
      } catch (error) {
        console.warn("Session verification failed:", error);
        if (isMounted) {
          setUser(null);
        }
      }
    };

    verifyAndStartSession();

    return () => {
      isMounted = false;
    };
  }, [userId, setUser, refetch]);

  return null; // No UI, just runs in the background
};

export default Heartbeat;
