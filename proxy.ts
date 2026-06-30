import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;

    // 1. Check for banned status and redirect with a context parameter
    if (token?.error === "BannedUser") {
      const url = new URL("/", req.url);
      url.searchParams.set("error", "banned");
      return NextResponse.redirect(url);
    }

    // 2. Check for deleted status and redirect with a context parameter
    if (token?.error === "DeletedUser") {
      const url = new URL("/", req.url);
      url.searchParams.set("error", "deleted");
      return NextResponse.redirect(url);
    }

    // 3. Valid user, proceed normally
    return NextResponse.next();
  },
  {
    callbacks: {
      // The authorized callback simply ensures a token exists before running the proxy function
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/home", "/semester/:sem*", "/dashboard", "/query"],
};
