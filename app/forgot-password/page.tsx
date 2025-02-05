"use client";

import { useState } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [prnNo, setPrnNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/requestReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, prnNo }),
      });

      const data = await res.json();
      if (res.ok) toast.success(data.message);

      if (res.status === 400 || res.status === 404) toast.error(data.error);

      console.log(data);
    } catch (error) {
      setMessage("Something went wrong.");
      console.error("Error resetting password:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md  rounded-xl px-6 py-8 sm:py-10 shadow-lg bg-gray-100 dark:bg-neutral-900/70 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-200 dark:from-zinc-900 rounded-xl"></div>
        <div className=" bg-zinc-200 border border-zinc-300 dark:border-zinc-800 dark:bg-white/5 backdrop-blur-2xl rounded-full w-16 h-16 relative">
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
        <div className="text-start mt-7 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white/80">
            Reset Password
          </h2>
        </div>
        <form onSubmit={handlePasswordReset} className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Enter your email
            </label>
            <div className="relative mt-1">
              <Input
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="Enter your email address"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="prnNo"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Enter your PRN number
            </label>
            <div className="relative mt-1">
              <Input
                id="prnNo"
                name="prnNo"
                required
                value={prnNo}
                onChange={(e) => setPrnNo(e.target.value)}
                className="pr-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="Enter your PRN number"
              />
            </div>
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
