"use server";
import { AppwriteException } from "node-appwrite";
import { DATABASE_ID, db, Query, SUBJECT_COLLECTION_ID } from "../appwrite";
import { Subject } from "../appwrite_types";

export async function fetchSubject({
  abbreviation,
  semester,
}: {
  abbreviation: string;
  semester: string;
}) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [
        Query.equal("abbreviation", abbreviation),
        Query.equal("semester", semester),
        Query.limit(1),
      ]
    );
    return response.documents[0] as unknown as Subject;
  } catch (error) {
    const err = error as AppwriteException;
    if (err.code === 404) {
      console.warn("Subject not found, returning null.");
      return null;
    }
    console.error("Error fetching subject:", err);
    return null;
  }
}

export async function fetchAllSubjects() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.orderAsc("semester"), Query.limit(100)]
    );
    // console.log("response", response);
    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      abbreviation: doc.abbreviation,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return null;
  }
}

export async function fetchAllSubjectsForSitemap() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.limit(5000), Query.select(["semester", "abbreviation"])]
    );

    return response.documents.map((doc) => ({
      sem: doc.semester as number,
      sub: doc.abbreviation as string,
    }));
  } catch (error) {
    console.error("Error fetching all subjects for sitemap:", error);
    return [];
  }
}
