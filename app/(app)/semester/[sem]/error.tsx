// app/(app)/semester/[sem]/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-neutral-500 text-center max-w-md">
        We couldn't fetch the subjects right now. It might be a temporary
        network issue.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
