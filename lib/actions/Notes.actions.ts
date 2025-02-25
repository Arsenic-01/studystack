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
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("subject", sub),
    ]);

    // Transform the documents to match the expected Note type
    const transformedNotes = response.documents.map((doc) => ({
      noteId: doc.$id, // Use document ID as noteId
      title: doc.title,
      description: doc.description,
      createdAt: doc.createdAt,
      fileId: doc.fileId,
      sem: doc.sem || "", // Ensure sem is included
      subjectId: doc.subjectId || "", // Ensure subjectId is included
      type_of_file: doc.type_of_file || "", // Ensure type_of_file is included
      unit: doc.unit || [], // Ensure unit is included
      users: {
        name: doc.users?.name || "Unknown User", // Handle missing user name
        userId: doc.users?.userId || "", // Ensure userId is included
      },
      subject: {
        name: doc.subject?.name || "Unknown Subject", // Handle missing subject name
      },
    }));

    return transformedNotes;
  } catch (error) {
    console.log("Error fetching notes:", error);
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
      uploadedBy: doc.users.name,
      subject: doc.subject.name,
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};
