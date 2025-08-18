"use server";

import { ID } from "node-appwrite";
import { DATABASE_ID, db, Query, FORM_COLLECTION_ID } from "../appwrite";
import { revalidatePath } from "next/cache";

// Create new Google Form link
export async function createFormLink({
  googleFormLink,
  createdBy,
  quizName,
  semester,
  abbreviation,
  formType,
}: {
  googleFormLink: string;
  createdBy: string;
  quizName: string;
  semester: string;
  formType: "googleForm" | "assignment" | "other";
  abbreviation: string;
}) {
  try {
    await db.createDocument(DATABASE_ID!, FORM_COLLECTION_ID!, ID.unique(), {
      url: googleFormLink,
      createdBy,
      title: quizName,
      abbreviation,
      semester,
      formType,
    });

    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error creating Google Form link:", error);
    return { success: false, error: "Failed to create link." };
  }
}

// Fetch all Google Form links for a subject
export async function fetchFormLinks({
  abbreviation,
}: {
  abbreviation: string;
}) {
  try {
    if (!abbreviation)
      throw new Error("abbreviation is required but was not provided.");

    const response = await db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
      Query.equal("abbreviation", abbreviation),
    ]);

    return response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdBy: doc.createdBy,
      quizName: doc.title,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
      formType: doc.formType,
    }));
  } catch (error) {
    console.error("Error fetching Google Form links:", error);
    return null;
  }
}

export async function fetchPaginatedFormLinks({
  abbreviation,
  limit,
  offset,
  filters,
}: {
  abbreviation: string;
  limit: number;
  offset: number;
  filters?: {
    search?: string;
    formType?: string;
  };
}) {
  if (!abbreviation) return { documents: [], total: 0 };

  try {
    // Start with the base queries that are always applied
    const queries: string[] = [
      Query.equal("abbreviation", abbreviation),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    // --- Dynamically add filter and search queries ---

    // 1. Add search query if a search term is provided
    // NOTE: For Appwrite Search to work, you must create a full-text index
    // on the 'title' attribute in your 'forms' collection settings.
    if (filters?.search && filters.search.trim() !== "") {
      queries.push(Query.search("title", filters.search));
    }

    // 2. Add formType filter if it's not 'all'
    if (filters?.formType && filters.formType !== "all") {
      queries.push(Query.equal("formType", filters.formType));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      FORM_COLLECTION_ID!,
      queries
    );

    const documents = response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdBy: doc.createdBy,
      quizName: doc.title,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
      formType: doc.formType,
    }));

    return {
      documents,
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching paginated Form links:", error);
    return { documents: [], total: 0 };
  }
}

// Edit Google Form link
export async function editFormLink({
  id,
  googleFormLink,
  quizName,
  semester,
  abbreviation,
  formType,
}: {
  id: string;
  googleFormLink: string;
  quizName: string;
  semester: string;
  abbreviation: string;
  formType: "googleForm" | "assignment" | "other";
}) {
  try {
    await db.updateDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id, {
      url: googleFormLink,
      title: quizName,
      formType,
    });
    revalidatePath(`/semester/${semester}/${abbreviation}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating Google Form link:", error);
    return { success: false, error: "Failed to update link." };
  }
}

// Delete Google Form link
export async function deleteFormLink({ id }: { id: string }) {
  try {
    await db.deleteDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Google Form link:", error);
    return { success: false, error: "Failed to delete link." };
  }
}

export async function fetchAllFormLinks() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
      Query.orderDesc("$createdAt"),
    ]);
    return response.documents.map((doc) => ({
      id: doc.$id,
      url: doc.url,
      createdBy: doc.createdBy,
      quizName: doc.title,
      abbreviation: doc.abbreviation,
      semester: doc.semester,
      formType: doc.formType,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error("Error fetching all form links:", error);
    return [];
  }
}
