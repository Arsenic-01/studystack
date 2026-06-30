import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
});
