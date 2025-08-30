import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// This function will be triggered by a POST request from your admin panel.
export async function POST(request: NextRequest) {
  // 1. Extract the secret token from the Authorization header
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  // 2. Check if the secret token is valid
  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // 3. Extract the tag to revalidate from the request body
  const { tag } = await request.json();

  if (!tag) {
    return NextResponse.json({ message: "Tag is required" }, { status: 400 });
  }

  // 4. Revalidate the cache for the given tag
  revalidateTag(tag);

  console.log(`Revalidated tag: ${tag}`);

  // 5. Return a success response
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
