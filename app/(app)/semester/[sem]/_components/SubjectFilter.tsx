// components/semester_page_components/SubjectList.tsx

"use client";

import { SessionUser, Subject } from "@/lib/appwrite_types";
import { Library } from "lucide-react";
import { useEffect } from "react";
import BreadcrumbWithDropdown from "./_helper/BreadCrumb";
import SubjectCard from "./SubjectCard";

interface SubjectListProps {
  sem: string;
  initialSubjects: Subject[];
  user: SessionUser | null;
}

const SubjectList = ({ sem, initialSubjects, user }: SubjectListProps) => {
  // Effect for scrolling to a #hash in the URL on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          // 1. Scroll the element into view
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          // 2. Add highlight classes
          element.classList.add(
            "ring-2",
            "ring-offset-2",
            "ring-primary",
            "rounded-lg",
            "transition-all",
            "duration-300",
            "ring-offset-background"
          );

          setTimeout(() => {
            element.classList.remove(
              "ring-2",
              "ring-offset-2",
              "ring-primary",
              "rounded-lg",
              "ring-offset-background"
            );
          }, 2000);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex justify-start items-center">
        <BreadcrumbWithDropdown sem={sem} />
      </div>

      <div className="mt-4">
        {initialSubjects && initialSubjects.length > 0 ? (
          initialSubjects.map((subject) => (
            <div key={subject.subjectId} id={`subject-${subject.subjectId}`}>
              <SubjectCard subject={subject} user={user} />
            </div>
          ))
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Library className="h-8 w-8 text-neutral-500" />
              <h3 className="text-lg font-medium">No Subjects Found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                There are no subjects available for this semester.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
