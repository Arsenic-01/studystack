// src/app/api/auth/[...nextauth]/route.ts

import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client, Databases, Models, Query } from "node-appwrite";

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
  class: "FY" | "SY" | "TY" | "None" | "Blocked" | "NULL";
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
            class: user.class,
          } as NextAuthUser & {
            role: string;
            prnNo: string;
            ban: boolean;
            class: string;
          };
        } catch (error: any) {
          console.error("Authentication failed:", error);

          // Pass specific errors (like "User not found") to the frontend toast
          if (error instanceof Error) {
            throw new Error(error.message);
          }

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
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
        token.prnNo = (user as any).prnNo;
        token.ban = (user as any).ban;
        token.class = (user as any).class;
      }

      if (token?.id) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 800);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ENDPOINT}/databases/${databaseId}/collections/${collectionId}/documents/${token.id}?queries[]=select("ban")&queries[]=select("role")&queries[]=select("name")&queries[]=select("class")`,
            {
              headers: {
                "X-Appwrite-Project": process.env.PROJECT_ID!,
                "X-Appwrite-Key": process.env.API_KEY!,
              },
              next: { tags: [`user-${token.id}`] },
              signal: controller.signal,
            },
          );
          clearTimeout(timeout);
          if (res.ok) {
            const dbUser = await res.json();

            token.role = dbUser.role;
            token.name = dbUser.name;
            token.class = dbUser.class;

            if (dbUser.ban === true) {
              token.error = "BannedUser";
            } else {
              delete token.error;
            }
          } else if (res.status === 404) {
            token.error = "DeletedUser";
          }
        } catch (error) {
          console.error("Error fetching cached user data:", error);
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
        (session.user as any).class = token.class;

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
