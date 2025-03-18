"use client";

import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/components/validation";
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

    setErrors({}); // Clear errors if validation passes

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
      <div className="w-full max-w-md rounded-xl px-6 py-8 2xl:py-10 shadow-lg bg-neutral-50 dark:bg-neutral-900/60 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-100 dark:from-zinc-900/70 rounded-xl"></div>
        <div className="bg-neutral-100 border border-zinc-300 dark:border-zinc-800 dark:bg-white/5 backdrop-blur-2xl rounded-full w-16 h-16 relative">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 40 40"
              className="w-8 h-8 left-1/2 top-1/2 -translate-x-1/2 translate-y-1/2 absolute  stroke-[#333537] text-[##d2d4d7]"
            >
              <rect
                width="28"
                height="38"
                x="6"
                y="1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                rx="6"
              ></rect>
              <rect
                width="20"
                height="38"
                x="6"
                y="1"
                stroke="currentColor"
                strokeWidth="2"
                rx="6"
              ></rect>
              <circle cx="21.5" cy="20.5" r="1.5" fill="currentColor"></circle>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 15 13"
              className="absolute w-5 h-5 top-1/2 pt-1 left-1/2 translate-x-1/2 translate-y-full right-[5px] stroke-[#333537] text-[##d2d4d7]"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M.5 6.648c0-.433.183-.823.476-1.097L5.608.937a1.5 1.5 0 0 1 2.117 2.126L5.632 5.147h7.321a1.5 1.5 0 1 1 0 3H5.631l2.094 2.085a1.5 1.5 0 1 1-2.117 2.126L.942 7.71A1.5 1.5 0 0 1 .5 6.649"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        <div className="text-start mt-7 md:mt-4">
          <h2 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-white/80">
            Reset Password
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Help us find your account
          </span>
        </div>
        <form onSubmit={handlePasswordReset} className="mt-6">
          <div className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Email
              </label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 "
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 font-semibold ml-1 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div>
                <label
                  htmlFor="prnNo"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  PRN number
                </label>
                <div className="relative mt-1">
                  <Input
                    id="prnNo"
                    name="prnNo"
                    required
                    value={prnNo}
                    onChange={(e) => setPrnNo(e.target.value)}
                    className="pr-10 "
                    placeholder="Enter your PRN number"
                  />
                  {errors.prnNo && (
                    <p className="text-red-500 font-semibold ml-1 text-sm mt-1">
                      {errors.prnNo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 ml-1">
            <Link
              href={"/"}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
          {<p className="text-red-500">{message}</p>}
          <RainbowButton className="w-full" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </RainbowButton>
        </form>
      </div>
    </div>
  );
}
