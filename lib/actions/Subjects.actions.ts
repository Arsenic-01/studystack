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
  } catch (error: any) {
    if (error.code === 404) {
      console.warn("Subject not found, returning null.");
      return null; // Return null instead of throwing an error
    }
    console.error("Error fetching subject:", error);
    return null;
  }
}
