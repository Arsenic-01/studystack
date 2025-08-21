"use server";

import {
  db,
  DATABASE_ID,
  USER_COLLECTION_ID,
  Query,
  SESSION_COLLECTION_ID,
  LOGIN_COLLECTION_ID,
  NOTE_COLLECTION_ID,
  YOUTUBE_COLLECTION_ID,
  FORM_COLLECTION_ID,
} from "@/lib/appwrite";
import { updateUserData } from "../appwrite_types";
import { Models } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { UpdateUserData } from "@/components/admin_components/admin_helper_components/UpdateUserModal";
import bcrypt from "bcryptjs";

export async function fetchUsers() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!);
    // ("response", response);

    return response.documents.map((doc) => ({
      id: doc.$id,
      prnNo: doc.prnNo,
      name: doc.name,
      role: doc.role as "admin" | "student" | "teacher",
      email: doc.email,
      password: doc.password,
    }));
  } catch (error) {
    console.log("Error fetching users:", error);
    return [];
  }
}

export async function updateUser(data: updateUserData) {
  try {
    const { id: userId, password, ...updateData } = data;

    const dataToUpdate: Partial<UpdateUserData> = { ...updateData };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    await db.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId,
      dataToUpdate
    );

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.deleteDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId);
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: (error as Error).message };
  }
}

interface Session {
  sessionId: string;
  sessionStart: string;
  sessionEnd?: string;
  isActive: boolean;
  userId: string;
}

export async function fetchSessions(
  userId: string,
  offset = 0
): Promise<Session[]> {
  if (!userId) return [];

  try {
    const response = await db.listDocuments(
      DATABASE_ID!,
      SESSION_COLLECTION_ID!,
      [
        Query.equal("userId", userId),
        Query.orderDesc("sessionStart"),
        Query.limit(25),
        Query.offset(offset),
      ]
    );
    // console.log("response", response);

    return response.documents.map((doc: Models.Document) => ({
      sessionId: doc.$id,
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

export async function fetchAdminDashboardStats() {
  try {
    // We only need the total count, so we request 0 documents.
    const [users, notes, youtubeLinks, formLinks] = await Promise.all([
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [Query.limit(1)]),
    ]);

    return {
      totalUsers: users.total,
      totalNotes: notes.total,
      totalYoutubeLinks: youtubeLinks.total,
      totalFormLinks: formLinks.total,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalNotes: 0,
      totalYoutubeLinks: 0,
      totalFormLinks: 0,
    };
  }
}
