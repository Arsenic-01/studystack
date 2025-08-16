"use server";

import { ID } from "node-appwrite";
import { DATABASE_ID, db, Query, FORM_COLLECTION_ID } from "../appwrite";
import { revalidatePath } from "next/cache";

// Create new Google Form link
export async function createFormLink({
  subjectId,
  googleFormLink,
  createdBy,
  quizName,
  semester,
  abbreviation,
}: {
  subjectId: string;
  googleFormLink: string;
  createdBy: string;
  quizName: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.createDocument(DATABASE_ID!, FORM_COLLECTION_ID!, ID.unique(), {
      subjectId,
      url: googleFormLink,
      createdBy,
      quizName,
    });

    // ✅ 3. After creating, revalidate the subject page
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating Google Form link:", error);
    return { success: false, error: "Failed to create link." };
  }
}

// Fetch all Google Form links for a subject
export async function fetchFormLinks({ subjectId }: { subjectId: string }) {
  try {
    if (!subjectId)
      throw new Error("subjectId is required but was not provided.");

    const response = await db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
      Query.equal("subjectId", subjectId),
    ]);

    return response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdBy: doc.createdBy,
      quizName: doc.quizName,
      subjectId: doc.subjectId,
    }));
  } catch (error) {
    console.error("Error fetching Google Form links:", error);
    return null;
  }
}

// Edit Google Form link
export async function editFormLink({
  id,
  googleFormLink,
  quizName,
  semester,
  abbreviation,
}: {
  id: string;
  googleFormLink: string;
  quizName: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id, {
      url: googleFormLink,
      quizName,
    });
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating Google Form link:", error);
    return { success: false, error: "Failed to update link." };
  }
}

// Delete Google Form link
export async function deleteFormLink({
  id,
  semester,
  abbreviation,
}: {
  id: string;
  semester: string;
  abbreviation: string;
}) {
  try {
    await db.deleteDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id);
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting Google Form link:", error);
    return { success: false, error: "Failed to delete link." };
  }
}
