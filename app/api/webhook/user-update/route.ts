import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-appwrite-webhook-secret");
    if (authHeader !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const userId = payload.$id;

    if (userId) {
      // { expire: 0 } is critical here. It forces immediate invalidation rather than stale-while-revalidate
      revalidateTag(`user-${userId}`, { expire: 0 });
      return NextResponse.json({ revalidated: true });
    }

    return NextResponse.json({ error: "No user ID found" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
