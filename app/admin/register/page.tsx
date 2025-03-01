"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  prnNo: z
    .string()
    .length(10, "PRN No must be exactly 10 digits")
    .regex(/^[0-9]{10}$/, "PRN No must be numeric"),
  name: z.string().min(6, "Full Name must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "teacher", "student"]),
});

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
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validation = formSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful!🎉 Please login.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-36 2xl:py-40 px-5 mx-auto">
      <div className="w-full mx-auto max-w-md rounded-xl px-6 py-8 sm:py-10 shadow-lg bg-neutral-50 dark:bg-neutral-950 backdrop-blur-2xl relative border border-zinc-300 dark:border-zinc-800">
        <div className="text-center flex-col items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create a new account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            name="prnNo"
            type="text"
            required
            value={form.prnNo}
            placeholder="Enter PRN No."
            onChange={handleChange}
            className="mt-1"
          />
          <Input
            name="name"
            type="text"
            required
            value={form.name}
            placeholder="Enter Full Name"
            onChange={handleChange}
            className="mt-1"
          />
          <Input
            name="email"
            type="email"
            required
            value={form.email}
            placeholder="Enter Email"
            onChange={handleChange}
            className="mt-1"
          />
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange}
              className="pr-10"
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
          <Select
            value={form.role}
            onValueChange={(role) => setForm((prev) => ({ ...prev, role }))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
          {error && (
            <p className="text-white text-center w-full bg-red-500 dark:bg-red-500/70 py-2 text-sm rounded-lg">
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
