"use server";

import { db, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/appwrite";
import { updateUserData } from "../appwrite_types";

export async function fetchUsers() {
  try {
    const response = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!);
    return response.documents.map((doc) => ({
      userid: doc.$id,
      prnNo: doc.prnNo,
      name: doc.name,
      role: doc.role as "admin" | "student" | "teacher",
      email: doc.email,
    }));
  } catch (error) {
    console.log("Error fetching users:", error);
    return [];
  }
}

export async function updateUser({
  userId,
  data,
}: {
  userId: string;
  data: updateUserData;
}) {
  try {
    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, userId, {
      ...data,
    });
    return true;
  } catch (error) {
    console.log("Error deleting user:", error);
    return false;
  }
}
