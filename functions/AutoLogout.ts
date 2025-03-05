import { Client, Databases, Query } from "node-appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Change if self-hosted
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!); // API key with database access

const db = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

async function autoLogoutUsers() {
  try {
    const now = new Date();
    const inactiveThreshold = new Date(now.getTime() - 15 * 60 * 1000); // 15 min ago

    // Fetch users with active sessions older than 15 min
    const users = await db.listDocuments(DATABASE_ID!, COLLECTION_ID!, [
      Query.lessThan("sessionStart", inactiveThreshold.toISOString()),
      Query.isNull("sessionEnd"),
    ]);

    for (const user of users.documents) {
      await db.updateDocument(DATABASE_ID!, COLLECTION_ID!, user.$id, {
        sessionEnd: now.toISOString(),
      });

      console.log(`User ${user.userId} auto-logged out`);
    }
  } catch (error) {
    console.error("Error logging out users:", error);
  }
}

autoLogoutUsers();
