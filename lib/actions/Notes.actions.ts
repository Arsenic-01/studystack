"use server";

import { DATABASE_ID, db, Query, SUBJECT_COLLECTION_ID } from "../appwrite";

export async function fetchNotesBySubject({ sub }: { sub: string }) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.equal("courseId", sub)]
    );
    return response.documents[0]?.uploadedNotes || [];
  } catch (error) {
    console.log("Error fetching notes:", error);
    return [];
  }
}
