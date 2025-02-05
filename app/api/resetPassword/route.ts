// pages/api/reset-password.ts
import bcrypt from "bcryptjs";
import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  try {
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("resetToken", token),
    ]);

    if (users.total === 0) {
      return NextResponse.json(
        { error: "Invalid or Expired token." },
        { status: 400 }
      );
    }

    const user = users.documents[0];

    if (new Date(user.resetTokenExpiry) < new Date()) {
      return NextResponse.json({ error: "Token Expired" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return NextResponse.json(
      { message: "Password Reset Successful 🎉" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
