"use server";
import { revalidatePath } from "next/cache";
import { DATABASE_ID, db, NEW_SUBJECT_COLLECTION_ID, Query } from "../appwrite";
import { Subject } from "../appwrite_types";
import { AppwriteException } from "node-appwrite";

export async function fetchSubject({ abbreviation }: { abbreviation: string }) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      [Query.equal("abbreviation", abbreviation), Query.limit(1)]
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
      NEW_SUBJECT_COLLECTION_ID!,
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

export const deleteSubject = async ({ subjectId }: { subjectId: string }) => {
  try {
    await db.deleteDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subjectId
    );

    revalidatePath("/admin/subjects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const updateSubject = async (subject: Subject) => {
  try {
    // Exclude subjectId from the data payload as it's the document ID
    const { subjectId, ...updateData } = subject;

    await db.updateDocument(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      subjectId,
      updateData
    );

    revalidatePath("/admin/subjects");

    return { success: true };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { success: false, error: (error as Error).message };
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

    // ✅ Revalidate the page after a change
    revalidatePath("/admin/subjects");

    return { success: true };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: (error as Error).message };
  }
};
