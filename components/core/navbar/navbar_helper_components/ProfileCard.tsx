"use client";

import { signOut, useSession } from "next-auth/react";

export default function ProfileCard() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-neutral-900">
      <h2 className="text-lg font-semibold">{session.user.name}</h2>
      <p className="text-sm text-gray-500">{session.user.email}</p>
      {"prnNo" in session.user && (
        <p className="text-sm text-gray-400">PRN: {session.user.prnNo}</p>
      )}
      {"role" in session.user && (
        <p className="text-sm text-gray-400">Role: {session.user.role}</p>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-3 px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
