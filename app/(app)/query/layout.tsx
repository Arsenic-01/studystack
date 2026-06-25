// app/(app)/layout.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query Submission",
  description: "Submit your academic queries to the relevant faculty member.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
