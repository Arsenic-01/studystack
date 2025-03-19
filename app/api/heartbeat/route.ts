import {
  DATABASE_ID,
  db,
  Query,
  SESSION_COLLECTION_ID,
  USER_COLLECTION_ID,
  LOGIN_COLLECTION_ID,
} from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const lastSessionStart = new Date().toISOString();

    // Fetch the latest active session
    const activeSessions = await db.listDocuments(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
        Query.limit(1), // Get the most recent active session
      ]
    );

    if (activeSessions.documents.length === 0) {
      // No active session found → Create a new one
      const sessionId = ID.unique();

      await db.createDocument(DATABASE_ID!, SESSION_COLLECTION_ID!, sessionId, {
        sessionStart: lastSessionStart,
        sessionEnd: null,
        sessionId,
        isActive: true,
        userId,
      });

      console.log("✅ New session created");

      await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId, {
        lastSessionStart,
      });

      // **Update Login History (Append to loginTime)**
      const loginTimestamp = new Date().toISOString();

      // Check if user already has a login history
      const existingLoginDocs = await db.listDocuments(
        DATABASE_ID!,
        LOGIN_COLLECTION_ID!,
        [Query.equal("userId", userId)]
      );

      if (existingLoginDocs.total > 0) {
        // If login record exists, update it by appending the new login time
        const loginDoc = existingLoginDocs.documents[0];
        const updatedLoginTimes = [
          ...(loginDoc.loginTime || []),
          loginTimestamp,
        ];

        await db.updateDocument(
          DATABASE_ID!,
          LOGIN_COLLECTION_ID!,
          loginDoc.$id,
          {
            loginTime: updatedLoginTimes,
          }
        );
      } else {
        // If no login record exists, create a new document
        await db.createDocument(
          DATABASE_ID!,
          LOGIN_COLLECTION_ID!,
          ID.unique(),
          {
            userId: userId,
            loginTime: [loginTimestamp], // Initialize as array
            userName: "Unknown User", // Ideally, fetch username from user collection
          }
        );
      }

      return NextResponse.json({
        message: "NEW_SESSION_CREATED",
      });
    } else {
      // Found an active session, just update lastSessionStart
      await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId, {
        lastSessionStart,
      });

      console.log(
        "Heartbeat response received at (IST):",
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      );

      return NextResponse.json({ message: "SESSION_ACTIVE" });
    }
  } catch (error) {
    console.error("❌ Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
