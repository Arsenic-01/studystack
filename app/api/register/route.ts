import { NextResponse } from "next/server";
import { db, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, prnNo, password, role } = await req.json();

    // Validate required fields
    if (!name || !email || !prnNo || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure role is valid
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUsers = await db.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("prnNo", prnNo)]
    );

    if (existingUsers.total > 0) {
      return NextResponse.json(
        { message: "User with this PRN already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = ID.unique();

    // Create user in database
    const user = await db.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId,
      {
        userId,
        name,
        email,
        prnNo,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        teacherSem: role === "teacher" ? [] : undefined,
        uploadedNotes: [],
        usersAdded: [],
        usersRemoved: [],
      }
    );

    return NextResponse.json({
      message: "User registered successfully",
      userId: user.$id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
