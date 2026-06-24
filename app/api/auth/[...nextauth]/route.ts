// src/app/api/auth/[...nextauth]/route.ts

import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client, Databases, Models, Query } from "node-appwrite";

// Initialize Appwrite Client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

const databases = new Databases(client);
const databaseId = process.env.DATABASE_ID!;
const collectionId = process.env.USER_COLLECTION_ID!;

export interface AppwriteUser extends Models.Document {
  prnNo: string;
  password: string;
  role: "student" | "teacher" | "admin";
  name: string;
  email: string;
  ban: boolean;
}

// Define how often to check the DB for ban status (in milliseconds)
// 5 minutes = 5 * 60 * 1000 = 300000ms
const BAN_CHECK_INTERVAL = 5 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        prnNo: { label: "PRN No.", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.prnNo || !credentials?.password) {
          throw new Error("Missing PRN number or password.");
        }

        try {
          const response = await databases.listDocuments<AppwriteUser>(
            databaseId,
            collectionId,
            [Query.equal("prnNo", credentials.prnNo)],
          );

          if (response.documents.length === 0) {
            throw new Error("User not found. Please check your PRN number.");
          }

          const user = response.documents[0];

          // Compare provided password with stored hash
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid password. Please try again.");
          }

          // Initial ban check on login
          if (user.ban === true) {
            throw new Error(
              "Your account is temporarily banned. Please contact an admin.",
            );
          }

          return {
            id: user.$id,
            name: user.name,
            email: user.email,
            role: user.role,
            prnNo: user.prnNo,
            ban: user.ban,
          } as NextAuthUser & { role: string; prnNo: string; ban: boolean };
        } catch (error: any) {
          console.error("Authentication failed:", error);

          // Pass specific errors (like "User not found") to the frontend toast
          if (error instanceof Error) {
            throw new Error(error.message);
          }

          // Fallback for unexpected database/network crashes
          throw new Error(
            "An unexpected server error occurred. Please try again later.",
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      const now = Date.now();

      // 1. Initial Sign-in: Populate token with user data and timestamp
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
        token.prnNo = (user as any).prnNo;
        token.ban = (user as any).ban;
        token.lastBanCheck = now;
      }

      // 2. Subsequent requests: Only re-verify if the 5-minute interval has passed
      if (token?.prnNo) {
        const lastCheck = (token.lastBanCheck as number) || 0;

        if (now - lastCheck > BAN_CHECK_INTERVAL) {
          try {
            const response = await databases.listDocuments<AppwriteUser>(
              databaseId,
              collectionId,
              [Query.equal("prnNo", token.prnNo as string)],
            );

            if (response.documents.length > 0) {
              const dbUser = response.documents[0];

              if (dbUser.ban === true) {
                token.error = "BannedUser";
              } else {
                delete token.error;
              }
            } else {
              token.error = "DeletedUser";
            }

            // Update the timestamp so we don't check again for another 5 minutes
            token.lastBanCheck = now;
          } catch (error) {
            console.error("Error re-verifying user status:", error);
            // If Appwrite network request fails, let them pass for now,
            // but do not update the timestamp so it tries again on the next request.
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).role = token.role;
        (session.user as any).prnNo = token.prnNo;

        (session as any).error = token.error;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
