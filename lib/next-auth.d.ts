// next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and can be accessed on the `token` object in the `session` callback
   */
  interface JWT {
    role?: string;
  }
}
