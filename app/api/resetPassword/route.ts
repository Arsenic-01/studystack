// pages/api/reset-password.ts
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const resetSchema = z.object({
  token: z.string().min(1, { message: "Token is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = resetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { token, password } = validation.data;

    // Hash the token from the URL to match the one in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by the hashed reset token
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("resetToken", hashedToken),
    ]);

    if (users.total === 0) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const user = users.documents[0];

    if (new Date(user.resetTokenExpiry) < new Date()) {
      return NextResponse.json(
        { error: "Token has expired." },
        { status: 410 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return NextResponse.json(
      { message: "Password has been reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
