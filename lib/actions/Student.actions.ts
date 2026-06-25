"use server";

import { DATABASE_ID, db, Query, SUBJECT_COLLECTION_ID } from "@/lib/appwrite";
import { Subject } from "../appwrite_types";
import { Models } from "node-appwrite";
import { cacheLife, cacheTag } from "next/cache";

export async function fetchSubjectsBySemester(
  semester: number,
): Promise<Subject[] | null> {
  "use cache";
  cacheTag("subjects", `subjects-sem-${semester}`);
  cacheLife("weeks");

  const sem = String(semester);

  try {
    const response: Models.DocumentList<Models.Document> =
      await db.listDocuments(DATABASE_ID!, SUBJECT_COLLECTION_ID!, [
        Query.equal("semester", sem),
      ]);

    if (response.total === 0) {
      return null;
    }

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      abbreviation: doc.abbreviation,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error) {
    console.error("❌ Unexpected error fetching subjects:", error);
    return null;
  }
}
