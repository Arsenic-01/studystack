"use client";

import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useUser } from "@/hooks/useUser";

/**
 * A skeleton loader that perfectly mimics the login form's structure.
 * This prevents any layout shift (CLS) while the session is being checked.
 */
export function AuthLoader() {
  return (
    // --- 1. Main container: Matches LoginForm's outer div exactly ---
    <div className="w-full max-w-md md:max-w-sm xl:max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800 animate-pulse">
      {/* --- 2. Header section --- */}
      <div className="text-start">
        <div className="h-7 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
      </div>

      {/* --- 3. Form section: Matches the <form> tag's margin and spacing --- */}
      <div className="mt-7 space-y-3">
        {/* --- 4. First Input Field (PRN Number) --- */}
        <div>
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-1"></div>
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
        </div>

        {/* --- 5. Second Input Field (Password) with padding-bottom --- */}
        <div className="pb-3">
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-1"></div>
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
          <div className="mt-3">
            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/5"></div>
          </div>
        </div>

        {/* --- 6. Submit Button --- */}
        <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full mt-3"></div>
      </div>
    </div>
  );
}

/**
 * A card displayed when the user is already authenticated.
 */
export function AlreadyLoggedInCard() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) return null;

  const handleContinue = () => {
    const destination =
      "role" in user && user.role === "admin" ? "/admin" : "/home";
    router.push(destination);
  };

  return (
    <div className="w-full max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl border border-zinc-300 dark:border-zinc-800 text-center">
      <p className="text-neutral-800 dark:text-white/80 mb-4">
        You are already logged in as{" "}
        <span className="font-semibold">{user.name}</span>.
      </p>
      <RainbowButton onClick={handleContinue}>
        Continue to Dashboard
      </RainbowButton>
    </div>
  );
}
