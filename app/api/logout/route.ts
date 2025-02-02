import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    (await cookieStore).delete("sessionToken"); // Fixed redundant await

    console.log("Session token deleted successfully");
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
