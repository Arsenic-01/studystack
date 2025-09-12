import { cn } from "@/lib/utils";
import React from "react";

const SectionTitle = ({
  title,
  className,
  divElement,
}: {
  title: string;
  className?: string;
  divElement?: boolean;
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center mx-auto gap-2 py-2 px-6 rounded-full border border-neutral-300 dark:border-neutral-800 text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-8",
        className
      )}
    >
      {divElement && (
        <span className="relative flex size-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex size-2 rounded-full bg-blue-400"></span>
        </span>
      )}
      {title}
    </div>
  );
};

export default SectionTitle;
