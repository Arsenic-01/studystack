import { NextRequest, NextResponse } from "next/server";
import {
  storage,
  db,
  DATABASE_ID,
  NOTE_COLLECTION_ID,
  BUCKET_ID,
} from "@/lib/appwrite";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const subjectId = formData.get("subjectId") as string;
    const sem = formData.get("sem") as string;
    const userId = formData.get("userId") as string;
    const userName = formData.get("userName") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const fileType = formData.get("fileType") as string;
    const unit = formData.get("unit") as string;
    const subjectName = formData.get("subjectName") as string;
    const abbreviation = formData.get("abbreviation") as string;
    if (
      !files.length ||
      !subjectId ||
      !sem ||
      !userId ||
      !title ||
      !description ||
      !fileType ||
      !unit ||
      !userName ||
      !subjectName ||
      !abbreviation
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // console.log("Uploading files", fileType);
    // console.log("Uploading unit", unit);

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          file
        );
        const noteId = ID.unique();
        // Create a note document in the database
        const newNote = await db.createDocument(
          DATABASE_ID!,
          NOTE_COLLECTION_ID!,
          noteId,
          {
            noteId: noteId,
            userId,
            userName,
            sem,
            title,
            description,
            fileId: uploadedFile.$id,
            subjectId,
            createdAt: new Date().toISOString(),
            type_of_file: fileType,
            unit,
            subjectName,
            abbreviation,
          }
        );

        return newNote;
      })
    );

    return NextResponse.json({ success: true, uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
