import { getDriveClient } from "@/lib/googleDrive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  // CORRECT: Access params.fileId directly. It is just an object property.
  const fileId = params.fileId;

  if (!fileId) {
    return new Response("File ID is required", { status: 400 });
  }

  try {
    const drive = await getDriveClient();

    // Fetch ONLY the thumbnailLink field for efficiency
    const { data } = await drive.files.get({
      fileId: fileId,
      fields: "thumbnailLink",
    });

    const thumbnailUrl = data.thumbnailLink;

    if (thumbnailUrl) {
      // Temporarily redirect the client to the fresh, short-lived URL
      return NextResponse.redirect(thumbnailUrl, 307);
    } else {
      // If no thumbnail exists, you can return a 404 or a placeholder
      return new Response("Thumbnail not found", { status: 404 });
    }
  } catch (error) {
    console.error(`Failed to fetch thumbnail for ${fileId}:`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
