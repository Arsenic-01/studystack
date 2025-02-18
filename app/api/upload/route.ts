import { NextRequest, NextResponse } from 'next/server';
import {
  storage,
  db,
  DATABASE_ID,
  NOTE_COLLECTION_ID,
  BUCKET_ID,
} from '@/lib/appwrite';
import { ID } from 'node-appwrite';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const subjectId = formData.get('subjectId') as string;
    const sem = formData.get('sem') as string;
    const userId = formData.get('userId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (
      !files.length ||
      !subjectId ||
      !sem ||
      !userId ||
      !title ||
      !description
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await storage.createFile(
          BUCKET_ID!,
          ID.unique(),
          file
        );
        const noteId = ID.unique();
        // Create a note document in the database
        const newNote = await db.createDocument(
          DATABASE_ID!,
          NOTE_COLLECTION_ID!,
          noteId,
          {
            noteId: noteId,
            users: userId,
            sem,
            title,
            description,
            fileId: uploadedFile.$id,
            subject: subjectId,
            createdAt: new Date().toISOString(),
          }
        );

        return newNote;
      })
    );

    return NextResponse.json({ success: true, uploadedFiles }, { status: 200 });
  } catch (error) {
    console.error('Upload failed', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
