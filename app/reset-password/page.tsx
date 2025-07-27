"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/components/validation_schema/validation";

export default function ResetPassword() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string }>({});
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Extract token safely
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setMessage("Invalid token.");
      return;
    }
    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.format();
      setErrors({
        password: fieldErrors.password?._errors[0],
      });
      setLoading(false);
      return;
    }

    setErrors({}); // Clear errors if validation passes

    try {
      const res = await fetch("/api/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.status === 400) toast.error(data.error);

      if (res.ok) {
        toast.success(data.message);
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (error) {
      setMessage("Something went wrong.");
      console.error("Error resetting password:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-32 xl:py-36">
      <div className="w-full max-w-md lg:max-w-sm xl:max-w-md rounded-xl px-6 py-8 shadow-lg bg-gray-100 dark:bg-neutral-900/70 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-100 dark:from-zinc-900/70 rounded-xl"></div>
        <div className="text-start mb-4">
          <h2 className="text-2xl font-bold z-50 text-gray-900 dark:text-white/80">
            Reset Password
          </h2>
        </div>
        <form onSubmit={handlePasswordReset} className=" space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              New Password
            </label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="NewPassword"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
                placeholder="Enter your new password"
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
          </div>
          {<p className="text-red-500">{message}</p>}
          <RainbowButton className="w-full" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </RainbowButton>
        </form>
      </div>
    </div>
  );
}
