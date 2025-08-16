import { DATABASE_ID, db, NOTE_COLLECTION_ID } from "@/lib/appwrite";
import { getDriveClient } from "@/lib/googleDrive";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const metaFields = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      semester: formData.get("semester") as string,
      type_of_file: formData.get("fileType") as string,
      unit: formData.get("unit") as string,
      userId: formData.get("userId") as string,
      userName: formData.get("userName") as string,
      abbreviation: formData.get("abbreviation") as string,
    };

    if (!file || Object.values(metaFields).some((v) => !v)) {
      return NextResponse.json(
        { error: "Missing required file or fields" },
        { status: 400 }
      );
    }

    const drive = await getDriveClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const driveFileResponse = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: DRIVE_FOLDER_ID ? [DRIVE_FOLDER_ID] : undefined,
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: bufferToStream(buffer),
      },
      fields: "id, name, size, mimeType",
    });

    const fileData = driveFileResponse.data;

    const [, { data: thumbData }] = await Promise.all([
      drive.permissions.create({
        fileId: fileData.id!,
        requestBody: { role: "reader", type: "anyone" },
      }),
      drive.files.get({
        fileId: fileData.id!,
        fields: "thumbnailLink",
      }),
    ]);

    const noteId = ID.unique();
    const newNote = await db.createDocument(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      noteId,
      {
        noteId,
        ...metaFields,
        fileId: fileData.id,
        fileUrl: `https://drive.google.com/file/d/${fileData.id}/preview`,
        mimeType: fileData.mimeType || "unknown",
        fileSize: fileData.size || 0,
        thumbNail: thumbData.thumbnailLink || null,
      }
    );
    revalidatePath(
      `/semester/${metaFields.semester}/${metaFields.abbreviation}`
    );

    return NextResponse.json(
      { success: true, uploadedFile: newNote },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Upload failed", error);

    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "error" in error.response.data &&
      error.response.data.error &&
      typeof error.response.data.error === "object" &&
      "message" in error.response.data.error &&
      typeof error.response.data.error.message === "string"
    ) {
      errorMessage = error.response.data.error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
