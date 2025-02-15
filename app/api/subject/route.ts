import { NextRequest, NextResponse } from "next/server";
import { db, DATABASE_ID, Query, SUBJECT_COLLECTION_ID } from "@/lib/appwrite";

export async function POST(req: NextRequest) {
  const { courseId } = await req.json();

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId ID" }, { status: 400 });
  }

  try {
    const subjects = await db.listDocuments(
      DATABASE_ID!,
      SUBJECT_COLLECTION_ID!,
      [Query.equal("courseId", courseId)]
    );
    console.log(subjects);

    return NextResponse.json({
      sem: subjects.documents[0]?.semester || "N/A",
      subjectId: subjects.documents[0]?.$id,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
