import { Client, Databases, Query, Storage } from "node-appwrite";

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

// Initialize Appwrite Database
const db = new Databases(client);
const storage = new Storage(client);

export { client, db, Query, storage };

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  USER_COLLECTION_ID,
  NOTE_COLLECTION_ID,
  BUCKET_ID,
  NEW_SUBJECT_COLLECTION_ID,
  YOUTUBE_COLLECTION_ID,
  SESSION_COLLECTION_ID,
  LOGIN_COLLECTION_ID,
} = process.env;
