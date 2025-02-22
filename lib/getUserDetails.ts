"use server";

import { db, USER_COLLECTION_ID, DATABASE_ID, Query } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { UserProps } from "./appwrite_types";

export async function getUserDetails(userId: string) {
  try {
    const user = await db.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );
    return {
      id: user.$id,
      name: user.name,
      prnNo: user.prnNo,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
      loginHistory: user.loginHistory,
      teacherSem: user.teacherSem,
      uploadedNotes: user.uploadedNotes,
      usersAdded: user.usersAdded,
      usersRemoved: user.usersRemoved,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
}
export async function getUserForProfile(sessionToken: string) {
  try {
    // Fetch user using session token or userId
    const user = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("sessionToken", sessionToken),
    ]);
    if (user.total > 0) {
      const userDetails = user.documents[0];
      return {
        userId: userDetails.$id,
        name: userDetails.name,
        prnNo: userDetails.prnNo,
        role: userDetails.role,
        email: userDetails.email,
        lastLogin: userDetails.lastLogin,
      };
    }
    throw new Error("User not found");
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }
}

export async function getLoggedInUser(): Promise<UserProps | null> {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("sessionToken")?.value;
    if (!sessionToken) {
      return null;
    }
    const user = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("sessionToken", sessionToken),
    ]);
    if (user.total > 0) {
      return {
        userId: user.documents[0].$id,
        name: user.documents[0].name,
        prnNo: user.documents[0].prnNo,
        role: user.documents[0].role,
        email: user.documents[0].email,
        lastLogin: user.documents[0].lastLogin,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
