"use server";

import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import { DATABASE_ID, db, Query, YOUTUBE_COLLECTION_ID } from "../appwrite";

export async function fetchYoutubeLinks({
  abbreviation,
}: {
  abbreviation: string;
}) {
  try {
    if (!abbreviation) {
      throw new Error("abbreviation is required but was not provided.");
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [Query.equal("abbreviation", abbreviation)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      title: doc.title,
      youtubeLink: doc.url,
      createdBy: doc.createdBy,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
    }));
  } catch (error) {
    console.error("Error fetching YouTube links:", error);
    return null;
  }
}

export async function fetchPaginatedYoutubeLinks({
  abbreviation,
  limit,
  offset,
}: {
  abbreviation: string;
  limit: number;
  offset: number;
}) {
  try {
    if (!abbreviation) {
      throw new Error("abbreviation is required but was not provided.");
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [
        Query.equal("abbreviation", abbreviation),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
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
      documents: documents,
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching YouTube links:", error);
    return { documents: [], total: 0 };
  }
}

export async function findYoutubePage(
  abbreviation: string,
  noteId: string,
  pageSize: number
) {
  try {
    // 1. Fetch the target document to get its creation date
    const targetNote = await db.getDocument(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      noteId
    );
    if (!targetNote) return 1;

    // 2. Count how many documents are NEWER than the target document
    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [
        Query.equal("abbreviation", abbreviation),
        Query.greaterThan("$createdAt", targetNote.$createdAt),
      ]
    );

    // The total count from the response is the 0-based index of our note
    const position = response.total;

    // 3. Calculate the page number
    const page = Math.floor(position / pageSize) + 1;
    return page;
  } catch (error) {
    console.error("Error finding note page:", error);
    return 1; // Fallback to page 1 on error
  }
}

export async function createYoutubeLink({
  youtubeLink,
  createdBy,
  title,
  semester,
  abbreviation,
}: {
  youtubeLink: string;
  createdBy: string;
  title: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.createDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, ID.unique(), {
      url: youtubeLink,
      createdBy,
      title,
      abbreviation,
      semester,
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating YouTube link:", error);
    return { success: false, error: "Failed to create link." };
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
      documents,
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching user YouTube links:", error);
    return { documents: [], total: 0 };
  }
}

export async function editYoutubeLink({
  id,
  youtubeLink,
  title,
}: {
  id: string;
  youtubeLink: string;
  title: string;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id, {
      url: youtubeLink,
      title: title,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating YouTube link:", error);
    return { success: false, error: "Failed to update link." };
  }
}

export async function deleteYoutubeLink({ id }: { id: string }) {
  try {
    await db.deleteDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting YouTube link:", error);
    return { success: false, error: "Failed to delete link." };
  }
}

export async function fetchAllYoutubeLinks() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );
    return response.documents.map((doc) => ({
      id: doc.$id,
      title: doc.title,
      youtubeLink: doc.url,
      createdBy: doc.createdBy,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error("Error fetching all YouTube links:", error);
    return [];
  }
}
