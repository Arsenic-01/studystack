"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { loginSchema } from "@/components/validation_schema/validation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [prnNo, setPrnNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ prnNo?: string; password?: string }>(
    {}
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Validate form fields
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

    // 2. Sign in with NextAuth
    try {
      const result = await signIn("credentials", {
        prnNo,
        password,
        redirect: false, // We handle redirect manually to show toasts
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
        console.error("Sign-in failed:", result.error);
      } else if (result?.ok) {
        toast.success("Logged in successfully! 🎉");
        router.refresh(); // Important to refresh server components and session
        // Let the main page component handle the redirect after session updates
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Sign-in exception:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-sm xl:max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
      <div className="text-start">
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
            disabled={loading}
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
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 disabled:opacity-50"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
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
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Signing In..." : "Sign In"}
        </RainbowButton>
      </form>
    </div>
  );
}
