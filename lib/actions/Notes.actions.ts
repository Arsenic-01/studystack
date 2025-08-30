"use server";

import {
  DATABASE_ID,
  db,
  NOTE_COLLECTION_ID,
  Query,
  USER_COLLECTION_ID,
} from "../appwrite";
import { Note } from "../appwrite_types";
import { getDriveClient } from "../googleDrive";

export async function fetchNotesBySubject({
  abbreviation,
}: {
  abbreviation: string;
}) {
  if (!abbreviation) return [];

  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("abbreviation", abbreviation),
    ]);

    return response.documents.map((doc) => ({
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
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

interface DeleteNoteParams {
  noteId: string;
  fileId: string;
}

export async function deleteNote({ noteId, fileId }: DeleteNoteParams) {
  try {
    const drive = await getDriveClient();
    await drive.files.delete({
      fileId: fileId,
    });
    await db.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note." };
  }
}

export const fetchAllNotes = async () => {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!);

    return response.documents.map((doc) => ({
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
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

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

export async function getAllTeachers() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("role", "teacher"),
      Query.limit(100),
      Query.select(["name"]),
      Query.orderAsc("name"),
    ]);

    // Return just an array of teacher names
    return response.documents.map((doc) => doc.name) as string[];
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    return [];
  }
}
