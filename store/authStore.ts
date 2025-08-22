// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  userId: string;
  name: string;
  email: string;
  prnNo: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
    }),
    { name: "auth-storage" }
  )
);
