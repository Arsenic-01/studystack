"use server";

import {
  db,
  DATABASE_ID,
  Query,
  NEW_SUBJECT_COLLECTION_ID,
  BUCKET_ID,
  PROJECT_ID,
} from "@/lib/appwrite";

// Fetch subjects for a given semester
export async function fetchSubjectsBySemester(semester: number) {
  const sem = String(semester);
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      [
        Query.equal("semester", sem), // Filter by semester
      ]
    );

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      code: doc.code,
      semester: doc.semester,
      notes: doc.notes,
      unit: doc.unit,
    }));
  } catch (error) {
    console.log("Error fetching subjects:", error);
    throw new Error("Failed to fetch subjects");
  }
}

export const getViewUrl = async (fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID!}/files/${fileId}/view?project=${PROJECT_ID!}&mode=admin`;
};
