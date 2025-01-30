// import { NextResponse } from "next/server";
// import { cookies } from "next/headers"; // Import cookies from Next.js
// import { db, USER_COLLECTION_ID, DATABASE_ID } from "@/lib/appwrite";
// import { Query } from "node-appwrite";

// export async function middleware(req: Request) {
//   // Await the cookies to access them correctly
//   const cookieStore = await cookies();

//   // Get the session token from cookies (it might be undefined)
//   const sessionToken = cookieStore.get("sessionToken");

//   if (!sessionToken) {
//     // If no session token is found, deny access (redirect to login)
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Check if sessionToken is a valid string before querying
//   if (typeof sessionToken !== "string") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Verify the session token in the database
//   try {
//     const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
//       Query.equal("sessionToken", sessionToken), // Pass the string sessionToken here
//     ]);

//     if (users.total === 0) {
//       // If no user found with that session token, deny access (redirect to login)
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // Session is valid, continue the request
//     return NextResponse.next();
//   } catch (error) {
//     console.error("Session verification failed", error);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }
