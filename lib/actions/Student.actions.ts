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

// Fetch subjects for a given semester
export async function fetchSubjectsBySemester(semester: number) {
  const sem = String(semester);
  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      NEW_SUBJECT_COLLECTION_ID!,
      [
        Query.equal("semester", sem), // Filter by semester
      ]
    );
    // console.log("response", response);
    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error) {
    console.log("Error fetching subjects:", error);
    throw new Error("Failed to fetch subjects");
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
