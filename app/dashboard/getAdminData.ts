import {
  DATABASE_ID,
  db,
  FORM_COLLECTION_ID,
  NOTE_COLLECTION_ID,
  Query,
  YOUTUBE_COLLECTION_ID,
} from "@/lib/appwrite";
import { Form, Note, Youtube } from "@/lib/appwrite_types";

export async function getUserNotes({
  userName,
  limit,
  offset,
}: {
  userName: string;
  limit: number;
  offset: number;
}) {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal("userName", userName),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
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

export async function getUserYoutubeLinks({
  userName,
  limit,
  offset,
}: {
  userName: string;
  limit: number;
  offset: number;
}) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [
        Query.equal("createdBy", userName),
        Query.orderDesc("$createdAt"),
        Query.limit(Number(limit)),
        Query.offset(offset),
      ]
    );

    const documents = response.documents.map((doc) => ({
      id: doc.$id,
      title: doc.title,
      youtubeLink: doc.url,
      createdBy: doc.createdBy,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
    }));

    return {
      documents: documents as Youtube[],
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching user YouTube links:", error);
    return { documents: [], total: 0 };
  }
}

export async function getUserForms({
  userName,
  limit,
  offset,
}: {
  userName: string;
  limit: number;
  offset: number;
}) {
  try {
    const response = await db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
      Query.equal("createdBy", userName),
      Query.orderDesc("$createdAt"),
      Query.limit(Number(limit)),
      Query.offset(offset),
    ]);

    const documents = response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdBy: doc.createdBy,
      quizName: doc.title,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
      formType: doc.formType,
    }));

    return {
      documents: documents as Form[],
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching user form links:", error);
    return { documents: [], total: 0 };
  }
}
