import { NextResponse } from "next/server";
import { 
  db, 
  DATABASE_ID, 
  USER_COLLECTION_ID,
  NOTE_COLLECTION_ID,     
  YOUTUBE_COLLECTION_ID,   
  FORM_COLLECTION_ID,      
  Query, 
} from "@/lib/appwrite";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CHATBOT_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [allUsers, notes, youtube, quizzes] = await Promise.all([
      db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, YOUTUBE_COLLECTION_ID!, [Query.limit(1)]),
      db.listDocuments(DATABASE_ID!, FORM_COLLECTION_ID!, [Query.limit(1)])
    ]);

    return NextResponse.json({
      total_users: allUsers.total,
      notes: notes.total,
      youtube_links: youtube.total,
      form_links: quizzes.total,
      total_resources: notes.total + youtube.total + quizzes.total
    });

  } catch (error) {
    console.error("Error fetching stats for bot:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform stats" },
      { status: 500 }
    );
  }
}