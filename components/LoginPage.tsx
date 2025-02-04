"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { toast } from "sonner";
import type React from "react";
import { UserContext } from "@/context/UserContext";

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
    <div className="w-full max-w-md space-y-8 rounded-xl px-4 sm:px-6 py-8 sm:py-10 shadow-lg bg-gray-100 dark:bg-neutral-900">
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

        <RainbowButton className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </RainbowButton>
      </form>
    </div>
  );
}
