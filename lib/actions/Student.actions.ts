"use server";

import { db, DATABASE_ID, SUBJECT_COLLECTION_ID, Query } from "@/lib/appwrite";

export async function fetchSubjects(limit: number, offset: number) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [
        Query.limit(limit), // Limit the number of documents fetched
        Query.offset(offset), // Specify the starting point
      ]
    );
    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      courseId: doc.courseId,
      semester: doc.semester,
      acronym: doc.acronym, // Fix typo: acryonym → acronym
      notes: doc.notes,
    }));
  } catch (error) {
    console.log("Error fetching subjects:", error);
    return null;
  }
}

// Fetch unique semesters
export async function fetchSemesters() {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [
        Query.select(["semester"]), // Fetch only the semester field
        Query.orderAsc("semester"), // Sort by semester
      ]
    );

    // Extract unique semesters
    const semesters = Array.from(
      new Set(response.documents.map((doc) => doc.semester))
    );

    return semesters.map((semester) => ({
      value: semester.toString(),
      label: `Semester ${semester}`,
    }));
  } catch (error) {
    console.log("Error fetching semesters:", error);
    throw new Error("Failed to fetch semesters");
  }
}

// Fetch subjects for a given semester
export async function fetchSubjectsBySemester(semester: number) {
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [
        Query.equal("semester", semester), // Filter by semester
      ]
    );

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      courseId: doc.courseId,
      semester: doc.semester,
      acronym: doc.acronym,
      notes: doc.notes,
    }));
  } catch (error) {
    console.log("Error fetching subjects:", error);
    throw new Error("Failed to fetch subjects");
  }
}
