"use server";
import { ID } from "node-appwrite";
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

export async function uploadFile(file: File) {
  try {
    const response = await storage.createFile(BUCKET_ID!, ID.unique(), file);
    const fileUrl = storage.getFileView(BUCKET_ID!, response.$id); // Ensure this returns a string
    return { $id: response.$id, url: fileUrl };
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
}

export async function createNote({
  title,
  description,
  file,
}: {
  title: string;
  description: string;
  file: File;
}) {
  try {
    const { $id, url } = await uploadFile(file); // Ensure `url` is a string
    await db.createDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, ID.unique(), {
      title,
      description,
      fileId: $id,
      fileUrl: url, // Ensure this is a string
    });
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
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
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};
