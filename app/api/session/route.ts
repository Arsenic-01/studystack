import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, USER_COLLECTION_ID, DATABASE_ID, Query } from "@/lib/appwrite";

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

  return NextResponse.json({
    user: users.documents[0],
  });
}
