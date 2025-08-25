"use client";

import { Subject } from "@/lib/appwrite_types";
import { Library, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import SubjectCard from "../notes_page_components/SubjectCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import BreadcrumbWithDropdown from "./semester_helper_components/BreadCrumb";

interface SubjectSearchProps {
  sem: string;
  initialSubjects: Subject[];
}

const SubjectSearch = ({ sem, initialSubjects }: SubjectSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const subjects = initialSubjects;

  const filteredSubjects = subjects
    ? subjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-7 md:flex-row md:justify-between md:items-center">
        <BreadcrumbWithDropdown sem={sem} />
        <div className="relative md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Subject by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 text-sm"
          />
          {searchQuery && (
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div key={subject.subjectId} id={`subject-${subject.subjectId}`}>
              <SubjectCard subject={subject} />
            </div>
          ))
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Library className="h-8 w-8 text-neutral-500" />
              <h3 className="text-lg font-medium">No Subjects Found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                No subjects match your search. Try a different query.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Reset Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSearch;
