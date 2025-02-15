"use server";
import { DATABASE_ID, db, Query, SUBJECT_COLLECTION_ID } from "../appwrite";

export async function fetchSubject({ courseId }: { courseId: string }) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.equal("courseId", courseId)]
    );
    console.log(response.documents);

    return response.documents;
  } catch (error) {
    console.log("Error fetching subjects:", error);
    return [];
  }
}
