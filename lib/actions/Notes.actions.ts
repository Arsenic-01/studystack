"use server";

import { revalidatePath } from "next/cache";
import { DATABASE_ID, db, NOTE_COLLECTION_ID, Query } from "../appwrite";
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
  semester: string;
  abbreviation: string;
  fromAdmin?: boolean;
}

export async function deleteNote({
  noteId,
  fileId,
  semester,
  abbreviation,
  fromAdmin,
}: DeleteNoteParams) {
  try {
    const drive = await getDriveClient();
    await drive.files.delete({
      fileId: fileId,
    });
    await db.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);
    if (fromAdmin) {
      revalidatePath(`/admin`);
    } else {
      revalidatePath(`/semester/${semester}/${abbreviation}`);
    }
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

interface EditNotesModalProps {
  noteId: string;
  title: string;
  description: string;
  type_of_file: string;
  semester: string;
  abbreviation: string;
  fromAdmin?: boolean;
}

export const editNotes = async (data: EditNotesModalProps) => {
  try {
    await db.updateDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, data.noteId, {
      title: data.title,
      description: data.description,
      type_of_file: data.type_of_file,
    });
    if (data.fromAdmin) {
      revalidatePath(`/admin`);
    } else {
      revalidatePath(`/semester/${data.semester}/${data.abbreviation}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Failed to update note." };
  }
};
