"use server";
import { DATABASE_ID, db, NEW_SUBJECT_COLLECTION_ID } from "../appwrite";

export async function fetchSubject({ subjectId }: { subjectId: string }) {
  try {
    const response = await db.getDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subjectId
    );

    return response;
  } catch (error) {
    console.log("Error fetching subjects:", error);
    return null;
  }
}
