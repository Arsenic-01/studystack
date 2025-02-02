import React from "react";
import { Button } from "./ui/button";
import { LucideArrowRight } from "lucide-react";
import { Subject } from "@/lib/appwrite_types";

const SubjectCard = ({ subject }: { subject: Subject }) => {
  return (
    <div className="flex flex-col items-start bg-neutral-50 dark:bg-neutral-900 my-5 rounded-xl gap-3 justify-center w-full border  border-neutral-200 dark:border-neutral-800 py-5 md:py-10 px-4 md:px-10">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">
          Subject:{" "}
          <span className="text-neutral-950 dark:text-white capitalize">
            {subject.name.toLowerCase()}
          </span>
        </h2>
        <h3 className="text-lg text-neutral-600 dark:text-neutral-400">
          Course Code : {subject.courseId}
        </h3>
      </div>
      <div className="inline-flex justify-end pt-5  w-full">
        <Button className="rounded-full px-5 py-2 items-self-end">
          View Notes <LucideArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default SubjectCard;
