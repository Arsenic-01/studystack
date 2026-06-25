import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 1. If there's no token, they aren't logged in. Block them.
        if (!token) return false;

        // 2. If the token has the "BannedUser" or "DeletedUser" flag we set in route.ts,
        // block them immediately. NextAuth will auto-redirect them to the sign-in page.
        if (token.error === "BannedUser" || token.error === "DeletedUser") {
          return false;
        }

        // 3. Otherwise, they are a valid, active user. Let them through.
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/home", "/semester/:sem*", "/dashboard", "/query"],
};
