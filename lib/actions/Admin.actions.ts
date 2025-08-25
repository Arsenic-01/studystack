"use server";

import {
  DATABASE_ID,
  db,
  FORM_COLLECTION_ID,
  NOTE_COLLECTION_ID,
  Query,
  USER_COLLECTION_ID,
  YOUTUBE_COLLECTION_ID,
} from "@/lib/appwrite";

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
