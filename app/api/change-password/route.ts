import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { db, DATABASE_ID, USER_COLLECTION_ID, Query } from "@/lib/appwrite";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long."),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }
    const { currentPassword, newPassword } = validation.data;

    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("email", session.user.email),
    ]);

    if (users.total === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const user = users.documents[0];

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect current password." },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
      password: hashedNewPassword,
    });

    return NextResponse.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
