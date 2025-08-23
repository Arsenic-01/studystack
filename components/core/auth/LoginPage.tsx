"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlreadyLoggedInCard,
  AuthLoader,
} from "./auth_helper_components/Helpers";
import { LoginForm } from "./auth_helper_components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Effect to handle redirection after a successful login
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const destination = session.user.role === "admin" ? "/admin" : "/home";
      router.replace(destination);
    }
  }, [status, session, router]);

  // While the session is being verified, show a skeleton loader
  if (status === "loading") {
    return <AuthLoader />;
  }

  // If the user is authenticated, show the "already logged in" card
  // The useEffect above will soon redirect them
  if (session?.user) {
    return <AlreadyLoggedInCard />;
  }

  // If unauthenticated, show the login form
  return <LoginForm />;
}
