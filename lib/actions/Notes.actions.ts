"use server";

import {
  DATABASE_ID,
  db,
  Query,
  NOTE_COLLECTION_ID,
  storage,
  BUCKET_ID,
} from "../appwrite";

export async function fetchNotesBySubject({ sub }: { sub: string }) {
  if (!sub) return []; // Prevents unnecessary fetches

  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("subjectId", sub),
    ]);

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

export async function deleteNote({
  noteId,
  fileId,
}: {
  noteId: string;
  fileId: string;
}) {
  try {
    await storage.deleteFile(BUCKET_ID!, fileId);
    await db.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
}

export const fetchAllNotes = async () => {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!);
    return response.documents.map((doc) => ({
      createdAt: doc.createdAt,
      title: doc.title,
      fileId: doc.fileId,
      uploadedBy: doc.userName,
      subject: doc.subjectName,
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
}

export const editNotes = async (data: EditNotesModalProps) => {
  try {
    const res = await db.updateDocument(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      data.noteId,
      {
        title: data.title,
        description: data.description,
        type_of_file: data.type_of_file,
      }
    );

    return res;
  } catch (error) {
    console.error("Error updating note:", error);
    return { error: error };
  }
};
