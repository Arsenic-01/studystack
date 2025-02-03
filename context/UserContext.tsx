"use client";
import React, {
  useState,
  createContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "@/lib/getUserDetails";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProps {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  lastLogin: string;
}

interface UserContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps | null;
  isLoading: boolean;
  error: Error | null;
  handleLogout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | null>(null);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const {
    data: user = null,
    isLoading,
    error,
  } = useQuery<UserProps | null, Error>({
    queryKey: ["user"],
    queryFn: getLoggedInUser as () => Promise<UserProps | null>, // Ensure correct return type
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    retry: 2, // Retry twice if query fails
  });

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    if (error) setIsLoggedIn(false);
  }, [error]);

  // Optimized Logout Function
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      localStorage.setItem("logout", "true");
      setTimeout(() => localStorage.removeItem("logout"), 500); // Reduce cleanup delay
      toast.success("Logout successful 🎉");
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [router]);

  // Optimized Local Storage Sync
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout" && event.newValue === "true") {
        router.replace("/login");
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const contextValue = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, user, isLoading, error, handleLogout }),
    [isLoggedIn, user, isLoading, error, handleLogout]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
