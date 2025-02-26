import { DATABASE_ID, db, YOUTUBE_COLLECTION_ID } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { youtubeLink, user, subjectId } = await req.json();

    // Validate input
    if (!youtubeLink) {
      return NextResponse.json(
        { error: "YouTube link is required" },
        { status: 400 }
      );
    }
    // Insert into Appwrite Database
    const response = await db.createDocument(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      ID.unique(),
      { url: youtubeLink, createdBy: user, subjectId: subjectId }
    );

    return NextResponse.json(
      { message: "YouTube link saved", data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appwrite Error:", error);
    return NextResponse.json(
      { error: "Failed to save YouTube link" },
      { status: 500 }
    );
  }
}
