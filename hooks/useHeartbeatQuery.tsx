import { useQuery } from "@tanstack/react-query";

const useHeartbeatQuery = (userId: string) => {
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
        "Heartbeat response received at :",
        new Date().toLocaleString()
      );

      // ✅ If a new session is created, fetch updated user data
      if (data.message === "NEW_SESSION_CREATED") {
        console.log("🔄 New session detected. Fetching updated user data...");
      }

      return data;
    },
    refetchInterval: 3 * 60 * 1000, // ✅ Fetch every 3 minutes after first fetch
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000,
  });
};

export default useHeartbeatQuery;
