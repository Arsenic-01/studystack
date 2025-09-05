"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { AlreadyLoggedInCard } from "./AlreadyLoggedInCard";

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

  return <LoginForm isSessionLoading={status === "loading"} />;
}
