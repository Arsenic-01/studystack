"use server";

import {
  DATABASE_ID,
  db,
  NEW_SUBJECT_COLLECTION_ID,
  Query,
  SESSION_COLLECTION_ID,
} from "@/lib/appwrite";
import { Models } from "node-appwrite";
import { session } from "../../store/authStore";
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

    if (response.total === 0) {
      console.warn("No subjects found for this semester, returning null.");
      return null;
    }

    return response.documents.map((doc) => ({
      subjectId: doc.$id,
      name: doc.name,
      abbreviation: doc.abbreviation,
      code: doc.code,
      semester: doc.semester,
      unit: doc.unit,
    }));
  } catch (error) {
    console.error("❌ Unexpected error fetching subjects:", error);
    return null;
  }
}

export const sessionStopLog = async (sessions: session[]) => {
  try {
    // Find the latest active session
    const latestSession = sessions.find((s) => s.isActive);

    if (!latestSession) {
      console.warn("No active session found to stop.");
      return null; // No active session to update
    }

    const response = await db.updateDocument(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      latestSession.sessionId,
      {
        sessionEnd: new Date().toISOString(),
        isActive: false,
      }
    );
    return response;
  } catch (error) {
    console.error("Error stopping session:", error);
    throw new Error("Failed to stop session");
  }
};
