"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlreadyLoggedInCard } from "./auth_helper_components/Helpers";
import { LoginForm } from "./auth_helper_components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Once the session is confirmed as authenticated, redirect the user.
    if (status === "authenticated" && session?.user) {
      router.replace("/home");
    }
  }, [status, session, router]);

  // If the user is authenticated, show a confirmation card while redirecting.
  // This handles the brief moment after authentication is confirmed but before
  // the redirect is complete.
  if (status === "authenticated") {
    return <AlreadyLoggedInCard />;
  }

  // For both "loading" and "unauthenticated" states, render the LoginForm.
  // We pass the loading status down to the form. This way, an unauthenticated
  // user sees the form immediately (in a disabled state) instead of a skeleton,
  // drastically improving the perceived performance.
  return <LoginForm isSessionLoading={status === "loading"} />;
}
