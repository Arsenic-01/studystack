// app/api/bot/latest-notes/route.ts
import { NextResponse } from "next/server";
import { db, DATABASE_ID, NOTE_COLLECTION_ID, Query } from "@/lib/appwrite";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CHATBOT_SECRET_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the semester from the URL (e.g., ?sem=5)
  const { searchParams } = new URL(request.url);
  const sem = searchParams.get('sem');

  try {
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(10)
    ];

    if (sem) queries.push(Query.equal("semester", sem));

    const latestNotes = await db.listDocuments(
      DATABASE_ID!, 
      NOTE_COLLECTION_ID!, 
      queries
    );
    
    const formattedNotes = latestNotes.documents.map(note => ({
      title: note.title,
      subject: note.abbreviation,
      description: note.description,
      date: note.$createdAt,
      user: note.userName,
      link: note.fileUrl 
    }));
    return NextResponse.json({ status: "success", notes: formattedNotes });

  } catch (error) {
    console.error("Error fetching latest notes for bot:", error);
    return NextResponse.json({ error: "Failed to fetch latest notes" }, { status: 500 });
  }
}