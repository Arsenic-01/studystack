import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split("Bearer ")[1];

  if (token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const { tag } = await request.json();

  if (!tag) {
    return NextResponse.json({ message: "Tag is required" }, { status: 400 });
  }
  revalidateTag(tag, { expire: 0 });

  console.log(`Revalidated tag: ${tag}`);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
