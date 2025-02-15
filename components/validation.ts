import { z } from "zod";

export const loginSchema = z.object({
  prnNo: z
    .string()
    .length(10, "PRN Number must be exactly 10 digits")
    .regex(/^\d{10}$/, "PRN Number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  prnNo: z
    .string()
    .length(10, "PRN Number must be exactly 10 digits")
    .regex(/^\d{10}$/, "PRN Number must contain only digits"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
