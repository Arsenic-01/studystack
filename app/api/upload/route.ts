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
import { useNotesStore } from "@/store/noteStore"; // Import Zustand store

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

    // Fetch the current subject document to check existing notes
    const subjectDoc = await db.getDocument(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      subjectId
    );

    if (!subjectDoc) {
      throw new Error("Subject document not found");
    }

    const existingNotes = Array.isArray(subjectDoc.notes)
      ? subjectDoc.notes
      : [];

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          file
        );

        // Create a note document in the database
        const newNote = await db.createDocument(
          DATABASE_ID!,
          NOTE_COLLECTION_ID!,
          ID.unique(),
          {
            noteId: uploadedFile.$id,
            users: userId,
            sem,
            uploadDate: new Date().toISOString(),
            fileId: uploadedFile.$id,
          }
        );

        // Update Zustand store with the new note
        useNotesStore.getState().addNote(newNote);

        await db.updateDocument(
          DATABASE_ID!,
          SUBJECT_COLLECTION_ID!,
          subjectId,
          {
            uplodedNotes: [...existingNotes, newNote.$id],
          }
        );

        return newNote;
      })
    );

    return NextResponse.json({ success: true, uploadedFiles });
  } catch (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
