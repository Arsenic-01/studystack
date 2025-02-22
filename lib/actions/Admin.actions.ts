"use server";

import { db, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/appwrite";
import { updateUserData } from "../appwrite_types";

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
      loginHistory: doc.loginHistory,
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

export async function getCurrentUser({ userId }: { userId: string }) {
  try {
    const response = await db.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );
    return {
      userId: response.$id,
      prnNo: response.prnNo,
      name: response.name,
      role: response.role as "admin" | "student" | "teacher",
      email: response.email,
    };
  } catch (error) {
    console.log("Error fetching user:", error);
    return null;
  }
}
