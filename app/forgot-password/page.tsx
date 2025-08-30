"use client";

import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/components/validation_schema/validation";
import Link from "next/link";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [prnNo, setPrnNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ prnNo?: string; email?: string }>({});

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsed = forgotPasswordSchema.safeParse({ prnNo, email });
    if (!parsed.success) {
      const fieldErrors = parsed.error.format();
      setErrors({
        prnNo: fieldErrors.prnNo?._errors[0],
        email: fieldErrors.email?._errors[0],
      });
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const res = await fetch("/api/requestReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, prnNo }),
      });

      const data = await res.json();
      if (res.ok) toast.success(data.message);
      if (res.status === 400 || res.status === 404) toast.error(data.error);
    } catch (error) {
      setMessage("Something went wrong.");
      console.error("Error resetting password:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-32 xl:py-36">
      <div className="w-full max-w-md md:max-w-sm xl:max-w-md rounded-xl px-6 py-8 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
        <div className="text-start">
          <h2 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-white/80">
            Reset Your Password
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Help us find your account
          </span>
        </div>
        <form onSubmit={handlePasswordReset} className="mt-7 space-y-3">
          <div>
            <label
              htmlFor="prnNo"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              PRN Number
            </label>
            <Input
              id="prnNo"
              name="prnNo"
              required
              value={prnNo}
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="Enter your email address"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 font-semibold ml-1 text-sm mt-1">
                {errors.email}
              </p>
            )}
            <div className="mt-3">
              <Link
                href={"/"}
                className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>

          {message && <p className="text-red-500">{message}</p>}

          <RainbowButton className="w-full" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </RainbowButton>
        </form>
      </div>
    </div>
  );
}
