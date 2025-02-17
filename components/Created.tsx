import React from "react";
import { IconCloudDemo } from "./IconCloudDemo";

const Created = () => {
  return (
    <div>
      <div className="flex justify-between items-center gap-10 border border-neutral-200 dark:border-neutral-800 px-5 rounded-xl">
        <p className="text-xl font-bold tracking-tighter max-w-lg">
          Developed a full-stack web application that allows students of diploma
          to search and access academic notes and resources. Implemented staff
          and admin authentication using Next JS + Appwrite for backend, made
          responsive user interface with TailwindCSS that provides users with a
          seamless experience across all devices. Practiced agile methodologies
          to optimize team efficiency and communication.
        </p>
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Created;
