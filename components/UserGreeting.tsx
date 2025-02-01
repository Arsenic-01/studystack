"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

type UserGreetingProps = {
  name: string;
  role: string;
  lastLogin: string;
};

export default function UserGreeting({
  name,
  role,
  lastLogin,
}: UserGreetingProps) {
  const [showLastLogin, setShowLastLogin] = useState(false);

  const lastLoginDate = new Date(lastLogin);
  const lastLoginFormatted = formatDistanceToNow(lastLoginDate, {
    addSuffix: true,
  });

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
      <p className="text-xl mb-2">Role: {role}</p>
      <button
        onClick={() => setShowLastLogin(!showLastLogin)}
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        {showLastLogin ? "Hide" : "Show"} last login time
      </button>
      {showLastLogin && (
        <p className="mt-2 text-gray-600">Last login: {lastLoginFormatted}</p>
      )}
    </div>
  );
}
