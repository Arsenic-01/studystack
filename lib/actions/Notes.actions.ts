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
      Query.equal("subjectId", sub),
    ]);
    return response.documents || [];
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
