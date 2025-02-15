import { NextRequest, NextResponse } from "next/server";
import {
  storage,
  db,
  DATABASE_ID,
  NOTE_COLLECTION_ID,
  SUBJECT_COLLECTION_ID,
  BUCKET_ID,
} from "@/lib/appwrite";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const subjectId = formData.get("subjectId") as string;
    const sem = Number(formData.get("sem"));
    const userId = formData.get("userId") as string;

    if (!files.length || !subjectId || !sem || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the current document to check existing notes
    const subjectDoc = await db.getDocument(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      subjectId
    );
    console.log("Subject Document:", subjectDoc); // Log fetched document

    if (!subjectDoc) {
      throw new Error("Subject document not found");
    }

    // Ensure notes is an array of document IDs
    const existingNotes = Array.isArray(subjectDoc.notes)
      ? subjectDoc.notes
      : [];
    console.log("Existing Notes:", existingNotes); // Log existing notes

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          file
        );

        // Ensure the notes field is an array of document IDs

        // Create a note document in the notes collection
        const res = await db.createDocument(
          DATABASE_ID!,
          NOTE_COLLECTION_ID!,
          ID.unique(),
          {
            noteId: uploadedFile.$id,
            users: userId, // Ensure it's an array if Appwrite expects one
            sem,
            uploadDate: new Date().toISOString(),
            fileId: uploadedFile.$id,
          }
        );
        console.log(res);

        await db.updateDocument(
          DATABASE_ID!,
          SUBJECT_COLLECTION_ID!,
          subjectId,
          {
            uplodedNotes: [...existingNotes, res.$id], // ✅ Append only the document ID
          }
        );

        return res;
      })
    );

    return NextResponse.json({ success: true, uploadedFiles });
  } catch (error) {
    console.error("Upload failed", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
