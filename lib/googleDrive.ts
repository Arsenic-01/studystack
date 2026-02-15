// lib/googleDrive.ts
"use server";

import { db } from "@/lib/appwrite";
import { google } from "googleapis";

const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes
const LOCK_DURATION = 60 * 1000; // 60 seconds
const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 10; 

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function refreshAndStoreToken(currentDBToken: {
  accessToken: string;
  expiresAt: number;
}) {
  // Double-check: Ensure state hasn't changed since the initial read
  const freshDoc = await db.getDocument(
    process.env.DATABASE_ID!,
    process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
    process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!
  );
  
  const freshExpiresAt = Number(freshDoc.expires_at);

  if (freshExpiresAt > Date.now() + TOKEN_EXPIRY_BUFFER) {
    return { accessToken: freshDoc.access_token, expiresAt: freshExpiresAt };
  }

  if (freshExpiresAt > Date.now()) {
     throw new Error("LOCKED"); 
  }

  // Acquire Lock
  const lockExpiresAt = Date.now() + LOCK_DURATION;
  await db.updateDocument(
    process.env.DATABASE_ID!,
    process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
    process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!,
    { expires_at: lockExpiresAt.toString() }
  );

  try {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams();
    params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
    params.append("refresh_token", process.env.GOOGLE_REFRESH_TOKEN!);
    params.append("grant_type", "refresh_token");

    const res = await fetch(tokenUrl, { method: "POST", body: params });
    const tokenData = await res.json();

    if (!res.ok) {
      throw new Error(`Google API Error: ${JSON.stringify(tokenData)}`);
    }

    const newExpiresAt = Date.now() + tokenData.expires_in * 1000;
    
    await db.updateDocument(
      process.env.DATABASE_ID!,
      process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
      process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!,
      {
        access_token: tokenData.access_token,
        expires_at: newExpiresAt.toString(),
        last_updated: new Date().toISOString(),
      }
    );
    
    return { accessToken: tokenData.access_token, expiresAt: newExpiresAt };

  } catch (error) {
    // Revert lock on failure
    await db.updateDocument(
      process.env.DATABASE_ID!,
      process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
      process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!,
      { expires_at: (Date.now() - 1000).toString() } 
    );
    throw error;
  }
}

export async function getDriveAccessToken(retryCount = 0): Promise<{ accessToken: string }> {
  if (retryCount > MAX_RETRIES) {
    throw new Error("Max retries exceeded waiting for Google Drive token refresh.");
  }

  const now = Date.now();

  const tokenDoc = await db.getDocument(
    process.env.DATABASE_ID!,
    process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
    process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!
  );

  let accessToken = tokenDoc.access_token as string;
  const expiresAt = Number(tokenDoc.expires_at);

  if (expiresAt > now + TOKEN_EXPIRY_BUFFER) {
    return { accessToken };
  }

  // If locked, wait and retry
  if (expiresAt > now) {
    await sleep(POLL_INTERVAL);
    return getDriveAccessToken(retryCount + 1); 
  }

  try {
    const refreshed = await refreshAndStoreToken({ accessToken, expiresAt });
    return { accessToken: refreshed.accessToken };
  } catch (error: any) {
    if (error.message === "LOCKED") {
      await sleep(POLL_INTERVAL);
      return getDriveAccessToken(retryCount + 1);
    }
    throw error;
  }
}

export async function getDriveClient() {
  const { accessToken } = await getDriveAccessToken();
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth: oauth2Client });
}
