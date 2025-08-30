"use server";

import { db } from "@/lib/appwrite";
import { google } from "googleapis";

const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minute buffer
const REFRESH_LOCK_GRACE_PERIOD = 60 * 1000; // 60 second lock

// This function is now responsible for the locking mechanism
async function refreshAndStoreToken(currentDBToken: {
  accessToken: string;
  expiresAt: number;
}) {
  console.log("Database token is stale. Attempting to acquire lock...");

  // ACQUIRE LOCK: Instantly update DB with a short grace period
  const lockExpiresAt = Date.now() + REFRESH_LOCK_GRACE_PERIOD;
  await db.updateDocument(
    process.env.DATABASE_ID!,
    process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
    process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!,
    { expires_at: lockExpiresAt.toString() }
  );
  console.log(
    `Lock acquired. Token is safe for ${REFRESH_LOCK_GRACE_PERIOD / 1000}s.`
  );

  try {
    // PERFORM REFRESH: Now safely get the new token from Google
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

    // RELEASE LOCK: Update DB with the real token and its long expiry
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
    console.log("Token refreshed and lock released.");
    return { accessToken: tokenData.access_token, expiresAt: newExpiresAt };
  } catch (error) {
    // If refresh fails, revert the lock to allow another instance to try
    await db.updateDocument(
      process.env.DATABASE_ID!,
      process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
      process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!,
      { expires_at: currentDBToken.expiresAt.toString() }
    );
    console.error("Failed to refresh token, lock reverted.", error);
    throw error;
  }
}

export async function getDriveAccessToken(): Promise<{ accessToken: string }> {
  const now = Date.now();

  const tokenDoc = await db.getDocument(
    process.env.DATABASE_ID!,
    process.env.GOOGLE_REFRESH_TOKEN_COLLECTION_ID!,
    process.env.GOOGLE_DRIVE_TOKEN_DOC_ID!
  );

  let accessToken = tokenDoc.access_token as string;
  const expiresAt = Number(tokenDoc.expires_at);

  if (now > expiresAt - TOKEN_EXPIRY_BUFFER) {
    // The token is stale. Instead of every instance refreshing,
    // the refresh function now handles the locking.
    const refreshed = await refreshAndStoreToken({ accessToken, expiresAt });
    accessToken = refreshed.accessToken;
  }

  return { accessToken };
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
