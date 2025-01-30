"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";

export default function RegisterPage() {
  const [form, setForm] = useState({
    prnNo: "0223031077",
    name: "Vedant Bhor",
    email: "vedbhor25@gmail.com",
    password: "kkwp@0078",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="flex min-h-screen flex-col items-center justify-center py-24 px-5"
    >
      <div className="w-full max-w-md space-y-8 rounded-xl px-4 sm:px-6 py-8 sm:py-10 shadow-lg bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register
          </h2>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
            <Input
              name="password"
              type="password"
              required
              value={form.password}
              placeholder="Enter Password"
              onChange={handleChange}
              className="mt-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <Select
              name="role"
              value={form.role}
              placeholder="Select Role"
              selectedKeys={[form.role]}
            >
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </Select>
          </div>
          <RainbowButton className="w-full" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </RainbowButton>
        </form>
      </div>
    </div>
  );
}
