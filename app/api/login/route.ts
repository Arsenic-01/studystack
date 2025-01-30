import { NextResponse } from "next/server";
import { db, Query, USER_COLLECTION_ID, DATABASE_ID } from "@/lib/appwrite";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"; // For secure cookie handling
import crypto from "crypto"; // To generate a secure session token

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

    // Generate a session token (e.g., using a secure random string or JWT)
    const sessionToken = crypto.randomBytes(64).toString("hex"); // A secure random token

    // Update the user's sessionToken field in the database
    await db.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id, // User document ID
      {
        sessionToken: sessionToken.toString(), // Set the session token
        lastLogin: new Date().toISOString(), // Update last login time
      }
    );

    // Set the session token in the httpOnly cookie for better security
    (await cookies()).set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/", // Path should be set to root for universal access
      maxAge: 60 * 60 * 24 * 7, // Set the cookie expiration (7 days)
    });

    // Return a successful response
    return NextResponse.json({
      message: "Login successful",
      userId: user.$id,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
