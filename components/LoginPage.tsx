"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { toast } from "sonner";
import type React from "react";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("LoginPage must be used within a UserContextProvider");
  }

  const { setIsLoggedIn, isLoggedIn, user, setUser } = userContext;

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin") {
        router.push(`/admin/${user.userId}`);
      } else {
        router.push("/home");
      }
    }
  }, [isLoggedIn, user, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [prnNo, setPrnNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("Login response:", data);

      setIsLoggedIn(true);
      setUser(data); // Setting user data here

      toast.success(`Logged in as ${data.name} 🎉`);
      if (data.role === "admin") {
        router.push(`/admin/${data.userId}`);
      } else {
        router.push("/home");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Welcome to StudyStack
        </h2>
        <span className="text-gray-600 dark:text-gray-400">
          Login to continue
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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
            type="text"
            required
            value={prnNo}
            onChange={(e) => setPrnNo(e.target.value)}
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            className="mt-1 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            placeholder="Enter your PRN number"
          />
        </div>
        <div>
          <div>
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
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
          <div className="mt-3">
            <Link
              href={"/forgot-password"}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <RainbowButton className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </RainbowButton>
      </form>
    </div>
  );
}
