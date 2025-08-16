"use server";

import { revalidatePath } from "next/cache";
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
      title: doc.title,
      youtubeLink: doc.url,
      subjectId: doc.subjectId,
      createdBy: doc.createdBy,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
    }));
  } catch (error) {
    console.error("Error fetching YouTube links:", error);
    return null;
  }
}

export async function editYoutubeLink({
  id,
  youtubeLink,
  title,
  semester,
  abbreviation,
}: {
  id: string;
  youtubeLink: string;
  title: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id, {
      url: youtubeLink,
      title: title,
    });
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating YouTube link:", error);
    return { success: false, error: "Failed to update link." };
  }
}

export async function deleteYoutubeLink({
  id,
  semester,
  abbreviation,
}: {
  id: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.deleteDocument(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, id);
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };

    return true;
  } catch (error) {
    console.error("Error deleting YouTube link:", error);
    return { success: false, error: "Failed to delete link." };
  }
}
