import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
  resetTokenExpiry: string;
  resetToken: string;
  sessionToken: string;
  createdAt: Date;
  lastSessionStart?: string;
}

export interface session {
  sessionId: string;
  sessionStart: string;
  sessionEnd: string;
  isActive: boolean;
  userId: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),

      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.setItem("logout", "true");
        setTimeout(() => localStorage.removeItem("logout"), 500);
      },
    }),
    { name: "auth-storage" }
  )
);
