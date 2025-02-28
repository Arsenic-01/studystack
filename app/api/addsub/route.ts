import { DATABASE_ID, db } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { subjectId, name, code, semester, units } = await req.json();

    if (
      !subjectId ||
      !name ||
      !code ||
      !semester ||
      !units ||
      !Array.isArray(units)
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid format" },
        { status: 400 }
      );
    }

    const sem = String(semester);

    await db.createDocument(
      DATABASE_ID!,
      process.env.NEW_SUBJECT_COLLECTION_ID!,
      subjectId,
      { subjectId, name, code, semester: sem, unit: units }
    );

    return NextResponse.json(
      { message: "Subject added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add subject" },
      { status: 500 }
    );
  }
}
