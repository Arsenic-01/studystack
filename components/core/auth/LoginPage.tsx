"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { AlreadyLoggedInCard } from "./AlreadyLoggedInCard";
import { toast } from "sonner";

// Extract the logic into a separate component so we can wrap it in Suspense
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "banned") {
      toast.error(
        "Your account has been temporarily banned. Please contact an admin.",
      );
    } else if (error === "deleted") {
      toast.error("Your account no longer exists or was removed.");
    }
  }, [searchParams]);

  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  useEffect(() => {
    // Once the session is confirmed as authenticated, redirect to the callbackUrl
    if (status === "authenticated" && session?.user) {
      router.replace(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  if (status === "authenticated") {
    return <AlreadyLoggedInCard />;
  }

  return (
    <LoginForm
      isSessionLoading={status === "loading"}
      callbackUrl={callbackUrl}
    />
  );
}

export default function LoginPage() {
  return (
    // Suspense is required by Next.js when using useSearchParams in a client component
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
