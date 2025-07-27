"use server";

import { DATABASE_ID, db, Query, YOUTUBE_COLLECTION_ID } from "../appwrite";

export async function fetchYoutubeLinks({ subjectId }: { subjectId: string }) {
  try {
    if (!subjectId) {
      throw new Error("subjectId is required but was not provided.");
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      YOUTUBE_COLLECTION_ID!,
      [Query.equal("subjectId", subjectId)]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdAt: doc.createdAt,
      createdBy: doc.createdBy,
    }));
  } catch (error) {
    console.error("Error fetching YouTube links:", error);
    return null;
  }
}

export async function editYoutubeLink({
  id,
  youtubeLink,
}: {
  id: string;
  youtubeLink: string;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id, {
      url: youtubeLink,
    });
    return true;
  } catch (error) {
    console.error("Error updating YouTube link:", error);
    return false;
  }
}

export async function deleteYoutubeLink(id: string) {
  try {
    await db.deleteDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id);
    return true;
  } catch (error) {
    console.error("Error deleting YouTube link:", error);
    return false;
  }
}
