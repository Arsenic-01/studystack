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

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/home");
    }
  }, [status, session, router]);

  if (status === "loading") return <AuthLoader />;

  if (session?.user) return <AlreadyLoggedInCard />;

  return <LoginForm />;
}
