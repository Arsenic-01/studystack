"use server";

import { ID } from "node-appwrite";
import { DATABASE_ID, db, FORM_COLLECTION_ID, Query } from "../appwrite";

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
    return { success: true };
  } catch (error) {
    console.error("Error creating Google Form link:", error);
    return { success: false, error: "Failed to create link." };
  }
}

// Fetch google form links for a specific user
export async function getUserForms({
  userName,
  limit,
  offset,
}: {
  userName: string;
  limit: number;
  offset: number;
}) {
  try {
    const response = await db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [
      Query.equal("createdBy", userName),
      Query.orderDesc("$createdAt"),
      Query.limit(Number(limit)),
      Query.offset(offset),
    ]);

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
    console.error("Error fetching user form links:", error);
    return { documents: [], total: 0 };
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

export const fetchPaginatedFormLinks = async ({
  abbreviation,
  limit,
  offset,
  filters,
}: {
  abbreviation: string;
  limit: number;
  offset: number;
  filters?: { formType?: string };
}) => {
  if (!abbreviation) return { documents: [], total: 0 };

  try {
    const queries: string[] = [
      Query.equal("abbreviation", abbreviation),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];
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
    return { documents, total: response.total };
  } catch (error) {
    console.error("Error fetching paginated Form links:", error);
    return { documents: [], total: 0 };
  }
};

// Edit Google Form link
export async function editFormLink({
  id,
  googleFormLink,
  quizName,
  formType,
}: {
  id: string;
  googleFormLink: string;
  quizName: string;
  formType: "googleForm" | "assignment" | "other";
}) {
  try {
    await db.updateDocument(DATABASE_ID!, FORM_COLLECTION_ID!, id, {
      url: googleFormLink,
      title: quizName,
      formType,
    });

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

export async function findFormPage(
  abbreviation: string,
  formId: string,
  pageSize: number,
  filters?: {
    formType?: string;
  }
) {
  try {
    const targetForm = await db.getDocument(
      DATABASE_ID!,
      FORM_COLLECTION_ID!,
      formId
    );
    if (!targetForm) return 1;

    const queries = [
      Query.equal("abbreviation", abbreviation),
      Query.greaterThan("$createdAt", targetForm.$createdAt),
    ];

    if (filters?.formType && filters.formType !== "all") {
      queries.push(Query.equal("formType", filters.formType));
    }

    const response = await db.listDocuments(
      DATABASE_ID!,
      FORM_COLLECTION_ID!,
      queries
    );

    const position = response.total;
    const page = Math.floor(position / pageSize) + 1;
    return page;
  } catch (error) {
    console.error("Error finding form page:", error);
    return 1;
  }
}
