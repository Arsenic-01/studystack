import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

const fetchSession = async () => {
  const res = await fetch("/api/session", {
    method: "POST",
    credentials: "include",
    cache: "no-store", // Ensure fresh check but prevent duplicate calls
  });
  if (!res.ok) {
    console.log("User not authenticated"); // 👈 just logging now
    return null; // return null instead of throwing
  }
  return res.json();
};

const useSessionQuery = () => {
  const { setUser } = useAuthStore();

  const queryResult = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401 errors
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Only refetch when explicitly called
    refetchOnReconnect: false,
  });

  // Update the auth store based on query results
  useEffect(() => {
    if (queryResult.data) {
      setUser(queryResult.data.user);
    } else if (queryResult.error) {
      setUser(null);
    }
  }, [queryResult.data, queryResult.error, setUser]);

  return queryResult;
};

export default useSessionQuery;
