import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  db,
  USER_COLLECTION_ID,
  DATABASE_ID,
  SESSION_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
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
        { message: "Invalid Password" },
        { status: 401 }
      );
    }

    // Fetch user's latest session
    const sessions = await db.listDocuments(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      [
        Query.equal("userId", user.$id),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ]
    );

    // If the last session is still active, mark it as inactive
    if (sessions.total > 0) {
      const lastSession = sessions.documents[0];

      if (!lastSession.sessionEnd) {
        await db.updateDocument(
          DATABASE_ID!,
          SESSION_COLLECTION_ID!,
          lastSession.$id,
          {
            sessionEnd: new Date().toISOString(),
            isActive: false,
          }
        );
        // console.log("updated user session", res);
      }
    }

    const sessionStartTime = new Date().toISOString();

    // Create a new session
    const sessionId = ID.unique();
    await db.createDocument(DATABASE_ID!, SESSION_COLLECTION_ID!, sessionId, {
      sessionStart: sessionStartTime,
      sessionId: sessionId,
      isActive: true,
      userId: user.$id,
    });

    // console.log("newSession", newSession);

    // Generate a new session token
    const sessionToken = randomUUID();

    // Update user document with sessionToken & lastSessionStart
    const updateDoc = await db.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id,
      {
        sessionToken,
        loginData: [...(user.loginData || []), new Date().toISOString()], // Ensure it's an array
        lastSessionStart: sessionStartTime,
      }
    );

    // console.log("updateDoc", updateDoc);

    // Set session token in a secure cookie
    (await cookies()).set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      message: "Login successful",
      userId: updateDoc.userId,
      role: updateDoc.role,
      name: updateDoc.name,
      email: updateDoc.email,
      prnNo: updateDoc.prnNo,
      loginData: updateDoc.loginData,
      lastSessionStart: updateDoc.lastSessionStart,
      resetTokenExpiry: updateDoc.resetTokenExpiry,
      resetToken: updateDoc.resetToken,
      sessionToken: updateDoc.sessionToken,
      createdAt: updateDoc.createdAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
