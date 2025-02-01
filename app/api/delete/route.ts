import { NextResponse } from "next/server";
import { db, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await db.deleteDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
