"use client";

import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useUser } from "@/hooks/useUser";

/**
 * A card displayed when the user is already authenticated.
 */
export function AlreadyLoggedInCard() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) return null;

  const handleContinue = () => {
    router.push("/home");
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
