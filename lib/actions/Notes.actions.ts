'use server';
// import * as sdk from 'node-appwrite';
import { ID, ImageFormat } from 'node-appwrite';
import {
  DATABASE_ID,
  db,
  Query,
  NOTE_COLLECTION_ID,
  storage,
  BUCKET_ID,
} from '../appwrite';

export async function fetchNotesBySubject({ sub }: { sub: string }) {
  try {
    const response = await db.listDocuments(DATABASE_ID!, NOTE_COLLECTION_ID!, [
      Query.equal('subject', sub),
    ]);

    // Transform the documents to match the expected structure
    const transformedNotes = response.documents.map((doc) => ({
      noteId: doc.$id, // Use the document ID as noteId
      title: doc.title,
      description: doc.description,
      createdAt: doc.createdAt,
      fileId: doc.fileId,
      users: {
        name: doc.users?.name || 'Unknown User', // Handle missing user name
      },
      subject: {
        name: doc.subject?.name || 'Unknown Subject', // Handle missing subject name
      },
    }));

    return transformedNotes;
  } catch (error) {
    console.log('Error fetching notes:', error);
    return [];
  }
}

export async function fetchNotesForPreview(fileId: string) {
  try {
    const result = await storage.getFilePreview(
      BUCKET_ID!, // bucketId
      fileId, // fileId
      100, // width
      100, // height
      undefined, // gravity
      undefined, // quality
      undefined, // borderWidth
      undefined, // borderColor
      undefined, // borderRadius
      undefined, // opacity
      undefined, // rotation
      undefined, // background
      ImageFormat.Jpg // output format
    );

    // Convert the ArrayBuffer to a Buffer
    const buffer = Buffer.from(result);

    // Convert the Buffer to a Base64 URL
    const base64Data = buffer.toString('base64');
    const previewUrl = `data:image/jpeg;base64,${base64Data}`;

    return previewUrl;
  } catch (error) {
    console.log('Error fetching notes-files for preview', error);
    return ''; // Return an empty string or a fallback image URL
  }
}
export async function uploadFile(file: File) {
  try {
    const response = await storage.createFile(BUCKET_ID!, ID.unique(), file);
    const fileUrl = storage.getFileView(BUCKET_ID!, response.$id); // Ensure this returns a string
    return { $id: response.$id, url: fileUrl };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function createNote({
  title,
  description,
  file,
}: {
  title: string;
  description: string;
  file: File;
}) {
  try {
    const { $id, url } = await uploadFile(file); // Ensure `url` is a string
    await db.createDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, ID.unique(), {
      title,
      description,
      fileId: $id,
      fileUrl: url, // Ensure this is a string
    });
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}
