import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, USER_COLLECTION_ID, DATABASE_ID } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto"; // Generate a secure session token

export async function POST(req: Request) {
  try {
    const { prnNo, password } = await req.json();

    if (!prnNo || !password) {
      return NextResponse.json(
        { message: "PRN Number and Password are required" },
        { status: 400 }
      );
    }

    // Fetch user by PRN No.
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("prnNo", prnNo),
    ]);

    if (users.total === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = users.documents[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate a new session token
    const sessionToken = randomUUID();

    // Update the user's sessionToken in the database
    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
      sessionToken,
      lastLogin: new Date().toISOString(),
    });

    // Set session token in a secure cookie
    (await cookies()).set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      message: "Login successful",
      userId: user.$id,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
