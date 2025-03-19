"use server";

import {
  db,
  DATABASE_ID,
  USER_COLLECTION_ID,
  Query,
  SESSION_COLLECTION_ID,
  LOGIN_COLLECTION_ID,
} from "@/lib/appwrite";
import { updateUserData } from "../appwrite_types";
import { Models } from "node-appwrite"; // Ensure you import Models from Appwrite SDK
import { session } from "@/store/authStore";

export async function fetchUsers() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!);
    // console.log("response", response);

    return response.documents.map((doc) => ({
      id: doc.$id,
      prnNo: doc.prnNo,
      name: doc.name,
      role: doc.role as "admin" | "student" | "teacher",
      email: doc.email,
      password: doc.password,
      // loginHistory: doc.loginData,
      // session: doc.session,
    }));
  } catch (error) {
    console.log("Error fetching users:", error);
    return [];
  }
}

export async function updateUser({ data }: { data: updateUserData }) {
  try {
    const userId = data.id;
    const filteredData = {
      prnNo: data.prnNo,
      name: data.name,
      role: data.role,
      email: data.email,
      password: data.password,
    };
    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId, {
      ...filteredData,
    });
    return true;
  } catch (error) {
    console.log("Error updating user:", error);
    return false;
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.deleteDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId);
    return true;
  } catch (error) {
    console.log("Error deleting user:", error);
    return false;
  }
}

export async function fetchSessions(userId: string): Promise<session[]> {
  if (!userId) return [];

  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.orderDesc("sessionStart"),
        Query.limit(100),
      ]
    );
    // console.log("response", response);

    // Transform Appwrite documents into Session[]
    return response.documents.map((doc: Models.Document) => ({
      sessionId: doc.$id, // Assuming $id is the session ID
      sessionStart: doc.sessionStart,
      sessionEnd: doc.sessionEnd,
      isActive: doc.isActive,
      userId: doc.userId,
    }));
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export async function getLoginHistory() {
  try {
    const res = await db.listDocuments(DATABASE_ID!, LOGIN_COLLECTION_ID!, [
      Query.orderDesc("$createdAt"),
    ]);
    return res.documents.map((doc) => ({
      userId: doc.userId,
      loginTime: doc.loginTime,
      userName: doc.userName,
    }));
  } catch (error) {
    console.error("Error fetching login history:", error);
  }
}
