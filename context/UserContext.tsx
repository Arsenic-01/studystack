"use client";
import React, {
  useState,
  createContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  handleLogout: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | null>(null);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.setItem("logout", "true");
      setTimeout(() => localStorage.removeItem("logout"), 500);
      toast.success("Logout successful 🎉");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }, [router]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "logout" && event.newValue === "true") {
        router.replace("/");
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const contextValue = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, user, setUser, handleLogout }),
    [isLoggedIn, user, handleLogout]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
