import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only allow if logged in
    },
  }
);

export const config = {
  matcher: ["/home", "/semester/:sem*", "/dashboard"],
};
