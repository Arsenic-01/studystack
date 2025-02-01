"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { toast } from "sonner";
import type React from "react"; // Added import for React

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [prnNo, setPrnNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const ParamError = searchParams.get("error");

  useEffect(() => {
    if (ParamError) {
      const errorMessages: { [key: string]: string } = {
        session_expired: "Session expired. Please login again.",
        user_not_found: "User not found. Please login again.",
        unauthorized_admin: "You are not authorized to access this page.",
        unauthorized_teacher: "You are not authorized to access this page.",
        server_error: "An internal server error occurred. Please try again.",
      };
      setError(errorMessages[ParamError] || "An unknown error occurred.");
      router.replace("/login", { scroll: false });
    }
  }, [ParamError, router]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prnNo, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Login Successful 🎉");

      console.log(data);

      router.push(`/${data?.role}/${data?.userId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl px-4 sm:px-6 py-8 sm:py-10 shadow-lg bg-gray-50 dark:bg-zinc-950">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Login
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <Input
            id="prn"
            name="prn"
            type="text"
            required
            value={prnNo}
            onChange={(e) => setPrnNo(e.target.value)}
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            className="mt-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            placeholder="Enter your PRN number"
          />
        </div>
        <div>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
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
        </div>
        {error && (
          <p className="text-white text-center w-full bg-red-500 dark:bg-red-500/70 py-2 text-sm rounded-lg">
            {error}
          </p>
        )}
        <RainbowButton className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </RainbowButton>
      </form>
    </div>
  );
}
