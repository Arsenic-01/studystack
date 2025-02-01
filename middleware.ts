import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, USER_COLLECTION_ID, DATABASE_ID } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL("/login?error=session_expired", req.url)
    );
  }

  try {
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal("sessionToken", sessionToken),
    ]);

    if (users.total === 0) {
      return NextResponse.redirect(
        new URL("/login?error=user_not_found", req.url)
      );
    }

    const user = users.documents[0];

    // Authorization checks for the different routes
    if (req.nextUrl.pathname.includes("/admin") && user.role !== "admin") {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized_admin", req.url)
      );
    }
    if (req.nextUrl.pathname.includes("/teacher") && user.role !== "teacher") {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized_teacher", req.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Session verification failed:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/teacher/:path*"],
};
