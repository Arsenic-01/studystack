import { db, USER_COLLECTION_ID, DATABASE_ID } from "@/lib/appwrite";

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
      lastLogin: user.lastLogin,
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
