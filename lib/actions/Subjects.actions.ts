"use server";
import { DATABASE_ID, db, NEW_SUBJECT_COLLECTION_ID, Query } from "../appwrite";
import { Subject } from "../appwrite_types";

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

export async function fetchAllSubjects() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      [Query.orderAsc("semester"), Query.limit(100)]
    );

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return null;
  }
}

export const deleteSubject = async ({ subjectId }: { subjectId: string }) => {
  try {
    await db.deleteDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subjectId
    );
    return true;
  } catch (error) {
    console.error("Error deleting subject:", error);
    return false;
  }
};

export const updateSubject = async (subject: Subject) => {
  try {
    await db.updateDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subject.subjectId,
      subject
    );
    return true;
  } catch (error) {
    console.error("Error updating subject:", error);
    return false;
  }
};

export const createSubject = async (subject: Subject) => {
  try {
    await db.createDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subject.subjectId,
      subject
    );
    return true;
  } catch (error) {
    console.error("Error creating subject:", error);
    return false;
  }
};
