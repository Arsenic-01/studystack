// /app/api/drive/upload-chunk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDriveAccessToken } from "@/lib/googleDrive";

export const runtime = "nodejs";
export const maxDuration = 30;

// Important: Next 13+ route handlers do not buffer req.body by default in Node runtime.
// We keep chunks < 4.5MB to respect Vercel Hobby limits.

export async function POST(req: NextRequest) {
  try {
    const uploadUrl = req.headers.get("x-upload-url");
    const contentRange = req.headers.get("x-content-range"); // "bytes start-end/total"
    const contentType =
      req.headers.get("x-content-type") || "application/octet-stream";
    const contentLength = req.headers.get("content-length") || "";

    if (!uploadUrl || !contentRange) {
      return NextResponse.json(
        { error: "Missing x-upload-url or x-content-range" },
        { status: 400 }
      );
    }

    const { accessToken } = await getDriveAccessToken();

    // Forward the raw stream to Google
    const gRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
        "Content-Range": contentRange,
        "Content-Length": contentLength,
      },
      body: req.body,
      // Node fetch streaming requires duplex in runtime, TS doesn't know about it → cast
      // @ts-expect-error this is unknown by the fetch API
      duplex: "half",
    });

    const status = gRes.status;
    const text = await gRes.text();

    // Mid-upload: Drive returns 308 with Range header, not JSON
    if (status === 308) {
      const range = gRes.headers.get("Range"); // e.g. "bytes=0-4194303"
      return NextResponse.json(
        {
          success: true,
          resume: true,
          status,
          range,
        },
        { status: 200 }
      ); // normalize to 200 for client simplicity
    }

    // Final chunk: 200 or 201 with JSON { id, name, ... }
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (status === 200 || status === 201) {
      return NextResponse.json({
        success: true,
        resume: false,
        status,
        data,
      });
    }

    // Any other error
    return NextResponse.json(
      { success: false, status, error: text },
      { status }
    );
  } catch (e: any) {
    console.error("Upload-chunk error:", e);
    return NextResponse.json(
      { error: e.message || "Internal error" },
      { status: 500 }
    );
  }
}
