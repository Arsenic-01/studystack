"use server";

import {
  DATABASE_ID,
  db,
  Query,
  NOTE_COLLECTION_ID,
  storage,
  BUCKET_ID,
} from "../appwrite";
import { revalidatePath } from "next/cache";

export async function fetchNotesBySubject({ sub }: { sub: string }) {
  if (!sub) return [];

  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("abbreviation", sub),
    ]);
    // console.log("response", response);
    return response.documents.map((doc) => ({
      noteId: doc.$id,
      title: doc.title,
      description: doc.description,
      createdAt: doc.createdAt,
      fileId: doc.fileId,
      sem: doc.sem || "",
      subjectId: doc.subjectId || "",
      type_of_file: doc.type_of_file || "",
      unit: doc.unit || [],
      users: {
        name: doc.userName || "Unknown User",
        userId: doc.userId || "",
      },
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

interface DeleteNoteParams {
  noteId: string;
  fileId: string;
  semester: string;
  abbreviation: string;
}

export async function deleteNote({
  noteId,
  fileId,
  semester,
  abbreviation,
}: DeleteNoteParams) {
  try {
    await storage.deleteFile(BUCKET_ID!, fileId);
    await db.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);

    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note." };
  }
}

export const fetchAllNotes = async () => {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!);
    // console.log("response", response);

    return response.documents.map((doc) => ({
      noteId: doc.$id,
      title: doc.title,
      description: doc.description,
      createdAt: doc.createdAt,
      fileId: doc.fileId,
      sem: doc.sem || "",
      subjectId: doc.subjectId || "",
      type_of_file: doc.type_of_file || "",
      unit: doc.unit || [],
      users: {
        name: doc.userName || "Unknown User",
        userId: doc.userId || "",
      },
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

interface EditNotesModalProps {
  noteId: string;
  title: string;
  description: string;
  type_of_file: string;
  semester: string;
  abbreviation: string;
}

export const editNotes = async (data: EditNotesModalProps) => {
  try {
    await db.updateDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, data.noteId, {
      title: data.title,
      description: data.description,
      type_of_file: data.type_of_file,
    });

    // ✅ 3. After editing, revalidate the subject page
    revalidatePath(`/semester/${data.semester}/${data.abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Failed to update note." };
  }
};
