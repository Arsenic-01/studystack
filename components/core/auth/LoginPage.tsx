"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { toast } from "sonner";
import Link from "next/link";
import { loginSchema } from "../../validation_schema/validation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use NextAuth's useSession hook

  const [showPassword, setShowPassword] = useState(false);
  const [prnNo, setPrnNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ prnNo?: string; password?: string }>(
    {}
  );

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting with PRN:", prnNo, "and Password:", password);

    const parsed = loginSchema.safeParse({ prnNo, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.format();
      setErrors({
        prnNo: fieldErrors.prnNo?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      setLoading(false);
      return;
    }

    setErrors({});

    // Use NextAuth's signIn function
    const result = await signIn("credentials", {
      prn: prnNo,
      password,
      redirect: false,
    });

    console.log("Sign-in result:", result);

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("Sign-in failed:", result.error);
    } else {
      // The session is now updated by NextAuth
      // The user will be redirected via the useSession hook automatically
      // We can also manually redirect, as shown below
      toast.success("Logged in successfully! 🎉");
      router.refresh(); // Refresh the session
      router.push(session?.user?.role === "admin" ? `/admin` : "/home");
    }
  };

  // Handle the session status provided by useSession
  if (status === "loading") {
    return (
      <div className="text-center">
        <p className="text-gray-800 dark:text-white/80">Loading session...</p>
      </div>
    );
  }

  // If the user is already authenticated, show the continue button
  if (status === "authenticated" && session?.user) {
    return (
      <div className="w-full max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800 text-center">
        <p className="text-gray-800 dark:text-white/80 mb-4">
          You are already logged in as {session.user.name}.
        </p>
        <RainbowButton
          onClick={() =>
            router.push(session.user.role === "admin" ? `/admin` : "/home")
          }
        >
          Continue to Dashboard
        </RainbowButton>
      </div>
    );
  }

  // If the user is unauthenticated, show the login form
  return (
    <div className="w-full max-w-md md:max-w-sm xl:max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-100 dark:from-zinc-900/70 rounded-xl"></div>
      <div className="bg-neutral-100 border border-zinc-300 dark:border-zinc-800 dark:bg-white/5 backdrop-blur-2xl rounded-full w-16 h-16 relative">
        <div className="relative">{/* SVG for the logo */}</div>
      </div>
      <div className="text-start mt-7 md:mt-4">
        <h2 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-white/80">
          Welcome to StudyStack
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Login to continue
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-7 space-y-3">
        <div>
          <label
            htmlFor="prn"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            PRN Number
          </label>
          <Input
            id="prn"
            name="prn"
            value={prnNo}
            required
            onChange={(e) => setPrnNo(e.target.value)}
            className="mt-1"
            placeholder="Enter your PRN number"
          />
          {errors.prnNo && (
            <p className="text-red-500 font-semibold ml-1 text-sm mt-1">
              {errors.prnNo}
            </p>
          )}
        </div>

        <div className="pb-3">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Password
          </label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 font-semibold ml-1 text-sm mt-1">
              {errors.password}
            </p>
          )}
          <div className="mt-3">
            <Link
              href={"/forgot-password"}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <RainbowButton className="w-full mt-3" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </RainbowButton>
      </form>
    </div>
  );
}
