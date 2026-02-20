import { NextResponse } from "next/server";
import { db, DATABASE_ID, USER_COLLECTION_ID, Query } from "@/lib/appwrite";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CHATBOT_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [allUsers, students, teachers, admins] = await Promise.all([
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
        Query.limit(1)
      ]),
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
        Query.equal("role", "student"),
        Query.limit(1)
      ]),
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
        Query.equal("role", "teacher"), 
        Query.limit(1)
      ]),
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
        Query.equal("role", "admin"), 
        Query.limit(1)
      ]),
    ]);

    return NextResponse.json({
      total_users: allUsers.total,
      students: students.total,
      teachers: teachers.total,
      admins: admins.total,
    });

  } catch (error) {
    console.error("Error fetching user counts for bot:", error);
    return NextResponse.json(
      { error: "Failed to fetch user counts" },
      { status: 500 }
    );
  }
}