// src/app/api/auth/[...nextauth]/route.ts

import { Models } from "node-appwrite";
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client, Databases, Query } from "node-appwrite";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!) // Your Appwrite endpoint
  .setProject(process.env.PROJECT_ID!) // Your Project ID
  .setKey(process.env.API_KEY!); // Server API key

const databases = new Databases(client);
const databaseId = process.env.DATABASE_ID!;
const collectionId = process.env.USER_COLLECTION_ID!;

export interface AppwriteUser extends Models.Document {
  prnNo: string;
  password: string;
  role: "student" | "teacher" | "admin";
  name: string;
  email: string;
}

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
          return null;
        }

        try {
          // Fetch user by PRN number
          const response = await databases.listDocuments<AppwriteUser>(
            databaseId,
            collectionId,
            [Query.equal("prnNo", credentials.prnNo)]
          );
          console.log("credentials", credentials);
          console.log("response", response);

          if (response.documents.length === 0) {
            return null; // No user found
          }

          const user = response.documents[0];
          console.log("Fetched user:", user);

          // Compare provided password with stored hash
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isValid);
          if (!isValid) {
            return null; // Wrong password
          }

          console.log("User authenticated:", user);

          // ✅ Return user object compatible with NextAuth
          return {
            id: user.$id,
            name: user.name,
            email: user.email,
            role: user.role,
            prnNo: user.prnNo,
          } as NextAuthUser & { role: string; prnNo: string };
        } catch (error) {
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.prnNo = user.prnNo;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.prnNo = token.prnNo;
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
