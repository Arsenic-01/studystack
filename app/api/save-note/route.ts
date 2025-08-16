// /api/save-note/route.ts
import { DATABASE_ID, db, NOTE_COLLECTION_ID } from "@/lib/appwrite";
import { getDriveClient } from "@/lib/googleDrive";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    // This route only receives JSON data, not FormData
    const body = await req.json();
    const { fileId, ...metaFields } = body;

    if (!fileId || !metaFields.title) {
      return NextResponse.json(
        { error: "Missing file ID or metadata" },
        { status: 400 }
      );
    }

    const drive = await getDriveClient();

    // Get thumbnail and set permissions AFTER the upload is complete
    const [, { data: thumbData }] = await Promise.all([
      drive.permissions.create({
        fileId: fileId,
        requestBody: { role: "reader", type: "anyone" },
      }),
      drive.files.get({
        fileId: fileId,
        fields: "thumbnailLink, mimeType, size",
      }),
    ]);

    const noteId = ID.unique();
    const newNote = await db.createDocument(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      noteId,
      {
        noteId,
        ...metaFields,
        fileId: fileId,
        fileUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        mimeType: thumbData.mimeType || "unknown",
        fileSize: thumbData.size || 0,
        thumbNail: thumbData.thumbnailLink || null,
      }
    );

    revalidatePath(
      `/semester/${metaFields.semester}/${metaFields.abbreviation}`
    );
    return NextResponse.json({ success: true, uploadedFile: newNote });
  } catch (error: any) {
    console.error("Failed to save note:", error.message);
    return NextResponse.json(
      { error: "Failed to save note metadata." },
      { status: 500 }
    );
  }
}
