"use server";

import {
  BUCKET_ID,
  DATABASE_ID,
  db,
  NEW_SUBJECT_COLLECTION_ID,
  PROJECT_ID,
  Query,
  SESSION_COLLECTION_ID,
} from "@/lib/appwrite";
import { session } from "../../store/authStore";
import { Models } from "node-appwrite";
import { Subject } from "../appwrite_types";

export async function fetchSubjectsBySemester(
  semester: number
): Promise<Subject[] | null> {
  const sem = String(semester);

  try {
    const response: Models.DocumentList<Models.Document> =
      await db.listDocuments(DATABASE_ID!, NEW_SUBJECT_COLLECTION_ID!, [
        Query.equal("semester", sem),
      ]);

    // console.log("📚 Subjects fetched:", response.total);

    if (response.total === 0) {
      console.warn("No subjects found for this semester, returning null.");
      return null;
    }

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error) {
    console.error("❌ Unexpected error fetching subjects:", error);
    return null;
  }
}

export const getViewUrl = async (fileId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID!}/files/${fileId}/view?project=${PROJECT_ID!}&mode=admin`;
};

export const sessionStopLog = async (sessions: session[]) => {
  try {
    // Find the latest active session
    // console.log("sessions", sessions);

    const latestSession = sessions.find((s) => s.isActive);
    // console.log("latestSession", latestSession);

    if (!latestSession) {
      console.warn("No active session found to stop.");
      return null; // No active session to update
    }

    const response = await db.updateDocument(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      latestSession.sessionId, // Use the actual session ID
      {
        sessionEnd: new Date().toISOString(),
        isActive: false,
      }
    );

    // console.log("Session stopped successfully", response);
    return response;
  } catch (error) {
    console.error("Error stopping session:", error);
    throw new Error("Failed to stop session");
  }
};

// @archive

// Fetch subjects for a given semester

// export async function fetchSubjectsBySemester(semester: number) {
//   const sem = String(semester);
//   try {
//     const response = await db.listDocuments(
//       DATABASE_ID!,
//       NEW_SUBJECT_COLLECTION_ID!,
//       [
//         Query.equal("semester", sem), // Filter by semester
//       ]
//     );
//     console.log("response", response);

//     return response.documents.map((doc) => ({
//       subjectId: doc.$id,
//       name: doc.name,
//       code: doc.code,
//       semester: doc.semester,
//       unit: doc.unit,
//     }));
//   } catch (error: any) {
//     console.log("Error fetching subjects:", error);
//     if (error.message === "NO_SUBJECTS_FOUND") {
//       throw new Error("No subjects found for the entered semester.");
//     }
//     throw new Error("Failed to fetch subjects");
//   }
// }
