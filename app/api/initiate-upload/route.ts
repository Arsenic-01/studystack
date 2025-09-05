// /app/api/initiate-upload/route.ts
import { getDriveAccessToken } from "@/lib/googleDrive";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;
interface InitiateUploadRequestBody {
  fileName: string;
  fileType: string;
}
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } =
      (await req.json()) as InitiateUploadRequestBody;
    const origin = req.headers.get("origin");

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing file metadata" },
        { status: 400 }
      );
    }

    if (!origin) {
      return NextResponse.json(
        { error: "Missing origin header" },
        { status: 400 }
      );
    }

    const { accessToken } = await getDriveAccessToken();

    const initiateRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": fileType,
          Origin: origin,
        },
        body: JSON.stringify({
          name: fileName,
          parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : undefined,
        }),
      }
    );

    if (!initiateRes.ok) {
      const errText = await initiateRes.text();
      return NextResponse.json(
        { error: `Failed to initiate upload: ${errText}` },
        { status: initiateRes.status }
      );
    }

    const uploadUrl = initiateRes.headers.get("location");
    if (!uploadUrl) {
      return NextResponse.json(
        { error: "Google did not return an upload URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, uploadUrl });
  } catch (e) {
    console.error("Initiate error:", e);
    // Check if the error is from JSON parsing (e.g., malformed request)
    if (e instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
