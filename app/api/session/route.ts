import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionToken = (await cookies()).get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
    Query.equal("sessionToken", sessionToken),
  ]);

  if (users.total === 0) {
    (await cookies()).delete("sessionToken");
    return NextResponse.json({ message: "Session invalid" }, { status: 401 });
  }

  const userData = users.documents[0];

  // Transforming the raw data into the desired format
  const formattedUser = {
    userId: userData.userId,
    name: userData.name,
    email: userData.email,
    prnNo: userData.prnNo,
    role: userData.role,
    resetTokenExpiry: userData.resetTokenExpiry || null,
    resetToken: userData.resetToken || null,
    sessionToken: userData.sessionToken,
    createdAt: new Date(userData.createdAt),
    lastSessionStart: userData.lastSessionStart || null,
  };

  return NextResponse.json({ user: formattedUser });
}
