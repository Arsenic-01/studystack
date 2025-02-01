"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({
    prnNo: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleRoleChange = (selectedKeys: any) => {
    const selectedRole = Array.from(selectedKeys).join(", ");
    setForm({ ...form, role: selectedRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful!🎉 Please login.");
      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="flex min-h-screen flex-col items-center justify-center py-24 xl:py-36 px-5"
    >
      <div className="w-full max-w-md space-y-8 rounded-xl px-4 sm:px-6 py-8 sm:py-10 shadow-lg bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              name="prnNo"
              type="text"
              required
              minLength={10}
              maxLength={10}
              pattern="[0-9]{10}"
              value={form.prnNo}
              placeholder="Enter PRN No."
              onChange={handleChange}
              className="mt-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Input
              name="name"
              type="text"
              required
              value={form.name}
              placeholder="Enter Full Name"
              onChange={handleChange}
              className="mt-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              required
              value={form.email}
              placeholder="Enter Email"
              onChange={handleChange}
              className="mt-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
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
          <div>
            <Select
              name="role"
              selectedKeys={new Set([form.role])}
              onSelectionChange={handleRoleChange}
              placeholder="Select Role"
            >
              <SelectItem key="student">Student</SelectItem>
              <SelectItem key="teacher">Teacher</SelectItem>
              <SelectItem key="admin">Admin</SelectItem>
            </Select>
          </div>
          {error && (
            <p className="text-white text-center w-full bg-red-500 dark:bg-red-500/70 py-2 text-sm rounded-lg">
              {error}
            </p>
          )}
          <RainbowButton className="w-full" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </RainbowButton>
        </form>
      </div>
    </div>
  );
}
