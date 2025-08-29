// pages/api/request-reset.ts
import crypto from "crypto";
import resend from "@/lib/resend";
import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import React from "react";
import { z } from "zod";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Zod schema for input validation
const requestSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  prnNo: z.string().min(1, { message: "PRN number is required." }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { email, prnNo } = validation.data;

    // Find user by email and PRN number
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("email", email),
      Query.equal("prnNo", prnNo),
    ]);

    // If a user is found, generate token and send email.
    // To prevent user enumeration, we won't reveal if the user was found or not.
    if (users.total > 0) {
      const user = users.documents[0];

      // Generate a secure token and its hashed version for DB storage
      const resetToken = crypto.randomBytes(32).toString("base64url");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const resetTokenExpiry = new Date(Date.now() + 3600 * 1000).toISOString(); // 1-hour expiry

      // Update user document with the hashed token and expiry
      await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
        resetToken: hashedToken,
        resetTokenExpiry,
      });

      // Send the original (un-hashed) token in the email
      const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
      const emailContent = React.createElement(PasswordResetEmail, {
        userName: user.name,
        resetLink: resetLink,
      });

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "[StudyStack] Password Reset Request",
        react: emailContent,
      });
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email and PRN exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
