"use server";

import { ID } from "node-appwrite";
import { DATABASE_ID, db, Query, FORM_COLLECTION_ID } from "../appwrite";

// Create new Google Form link
export async function createFormLink({
  subjectId,
  googleFormLink,
  createdBy,
  quizName,
}: {
  subjectId: string;
  googleFormLink: string;
  createdBy: string;
  quizName: string;
}) {
  try {
    await db.createDocument(DATABASE_ID!, FORM_COLLECTION_ID!, ID.unique(), {
      subjectId,
      url: googleFormLink,
      createdBy,
      quizName,
    });
    return true;
  } catch (error) {
    console.error("Error creating Google Form link:", error);
    return false;
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
}: {
  id: string;
  googleFormLink: string;
  quizName: string;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id, {
      url: googleFormLink,
      quizName,
    });
    return true;
  } catch (error) {
    console.error("Error updating Google Form link:", error);
    return false;
  }
}

// Delete Google Form link
export async function deleteFormLink(id: string) {
  try {
    await db.deleteDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id);
    return true;
  } catch (error) {
    console.error("Error deleting Google Form link:", error);
    return false;
  }
}
