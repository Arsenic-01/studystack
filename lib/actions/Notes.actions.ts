"use server";

import { ID } from "node-appwrite";
import {
  CACHE_COLLECTION_ID,
  DATABASE_ID,
  db,
  NOTE_COLLECTION_ID,
  Query,
  UPLOADERS_CACHE_DOCUMENT_ID,
} from "../appwrite";
import { Note } from "../appwrite_types";
import { getDriveClient } from "../googleDrive";
import { revalidatePath } from "next/cache";

export async function saveNoteMetadata(body: {
  fileId: string;
  title: string;
  description?: string;
  type_of_file: string;
  unit: string;
  semester: string;
  userId: string;
  userName: string;
  abbreviation: string;
}) {
  try {
    const { fileId, ...metaFields } = body;

    if (!fileId || !metaFields.title) {
      throw new Error("Missing file ID or metadata");
    }

    const drive = await getDriveClient();

    // Set the file to be publicly readable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    // Get essential file metadata
    const { data: fileMetadata } = await drive.files.get({
      fileId: fileId,
      fields: "mimeType, size",
    });

    const noteId = ID.unique();
    await db.createDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId, {
      noteId,
      ...metaFields,
      fileId: fileId,
      fileUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      mimeType: fileMetadata.mimeType || "unknown",
      fileSize: fileMetadata.size ? fileMetadata.size.toString() : "0",
      thumbNail: `https://drive.google.com/thumbnail?id=${fileId}`,
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to save note:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

interface DeleteNoteParams {
  noteId: string;
  fileId: string;
}

export async function deleteNote({ noteId, fileId }: DeleteNoteParams) {
  try {
    const drive = await getDriveClient();
    await db.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);
    await drive.files.delete({
      fileId: fileId,
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note." };
  }
}

export interface EditNotesModalFunctionProps {
  noteId: string;
  title: string;
  description: string;
  type_of_file: string;
}

export const editNotes = async (data: EditNotesModalFunctionProps) => {
  try {
    await db.updateDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, data.noteId, {
      title: data.title,
      description: data.description,
      type_of_file: data.type_of_file,
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Failed to update note." };
  }
};

export async function fetchPaginatedNotes({
  abbreviation,
  limit,
  offset,
  filters,
}: {
  abbreviation: string;
  limit: number;
  offset: number;
  filters?: {
    type_of_file?: string[];
    unit?: string;
    userName?: string[];
  };
}) {
  if (!abbreviation) return { documents: [], total: 0 };

  try {
    const queries = [
      Query.equal("abbreviation", abbreviation),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    if (filters?.type_of_file && filters.type_of_file.length > 0) {
      queries.push(Query.equal("type_of_file", filters.type_of_file));
    }
    if (filters?.unit && filters.unit !== "All") {
      queries.push(Query.equal("unit", filters.unit));
    }
    if (filters?.userName && filters.userName.length > 0) {
      queries.push(Query.equal("userName", filters.userName));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      queries
    );

    const documents = response.documents.map((doc) => ({
      noteId: doc.$id,
      title: doc.title,
      description: doc.description,
      createdAt: doc.$createdAt,
      fileId: doc.fileId,
      semester: doc.semester || "",
      type_of_file: doc.type_of_file || "",
      unit: doc.unit || [],
      users: {
        name: doc.userName || "Unknown User",
        userId: doc.userId || "",
      },
      abbreviation: doc.abbreviation || "",
      fileUrl: doc.fileUrl || "",
      mimeType: doc.mimeType || "",
      fileSize: doc.fileSize || "",
      thumbNail: doc.thumbNail || "",
    }));

    return {
      documents: documents as Note[],
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching paginated notes:", error);
    return { documents: [], total: 0 };
  }
}

interface UploaderCache {
  all: string[];
  [subjectAbbreviation: string]: string[];
}

async function getUploaderOptions(): Promise<UploaderCache> {
  try {
    const document = await db.getDocument(
      DATABASE_ID!,
      CACHE_COLLECTION_ID!,
      UPLOADERS_CACHE_DOCUMENT_ID!
    );

    // The data is stored as a string, so we need to parse it
    if (document.data) {
      return JSON.parse(document.data) as UploaderCache;
    }

    return { all: [] }; // Return empty state if data is not available
  } catch (error) {
    console.error("Error fetching uploader cache:", error);
    // Return a default empty object on error so the UI doesn't crash
    return { all: [] };
  }
}

export async function getUploadersForSubject(abbreviation: string) {
  if (!abbreviation) return [];
  const options = await getUploaderOptions();
  // The cache object has keys for each subject abbreviation
  return options[abbreviation] || [];
}

export async function getUserNotes(userName: string) {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("userName", userName),
      Query.orderDesc("$createdAt"),
    ]);

    const documents = response.documents.map((doc) => ({
      noteId: doc.$id,
      title: doc.title,
      description: doc.description,
      createdAt: doc.$createdAt,
      fileId: doc.fileId,
      semester: doc.semester || "",
      type_of_file: doc.type_of_file || "",
      unit: doc.unit || [],
      users: {
        name: doc.userName || "Unknown User",
        userId: doc.userId || "",
      },
      abbreviation: doc.abbreviation || "",
      fileUrl: doc.fileUrl || "",
      mimeType: doc.mimeType || "",
      fileSize: doc.fileSize || "",
      thumbNail: doc.thumbNail || "",
    }));

    return {
      documents: documents as Note[],
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching user notes:", error);
    return { documents: [], total: 0 };
  }
}
