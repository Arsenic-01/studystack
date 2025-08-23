"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { SessionUser } from "@/lib/appwrite_types";

interface UserContextValue {
  user: SessionUser | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user as SessionUser);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, session]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading: status === "loading",
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}
