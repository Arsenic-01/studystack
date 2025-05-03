import { useQuery } from "@tanstack/react-query";

interface HeartbeatOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

const useHeartbeatQuery = (userId: string, options?: HeartbeatOptions) => {
  return useQuery({
    queryKey: ["heartbeat", userId],
    queryFn: async () => {
      const response = await fetch("/api/heartbeat", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to update heartbeat");
      }

      const data = await response.json();

      console.log(
        "Heartbeat response received at:",
        new Date().toLocaleString()
      );

      if (data.message === "NEW_SESSION_CREATED") {
        console.log("🔄 New session detected. Fetching updated user data...");
      }

      return data;
    },
    refetchInterval: options?.refetchInterval ?? 3 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export default useHeartbeatQuery;
