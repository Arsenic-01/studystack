"use client";

import useHeartbeatQuery from "@/hooks/useHeartbeatQuery";

const Heartbeat = ({ userId }: { userId: string }) => {
  useHeartbeatQuery(userId); // Fetch once on mount, then every 3 minutes

  return null; // No UI, just runs in the background
};

export default Heartbeat;
