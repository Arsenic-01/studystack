"use client";

import { Subject } from "@/lib/appwrite_types";
import { Library, Search, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import SubjectCard from "../notes_page_components/SubjectCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import BreadcrumbWithDropdown from "./semester_helper_components/BreadCrumb";

interface SubjectSearchProps {
  sem: string;
  initialSubjects: Subject[];
}

const SubjectSearch = ({ sem, initialSubjects }: SubjectSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // This will only re-run when initialSubjects or the debounced searchQuery changes.
  const filteredSubjects = useMemo(() => {
    if (!initialSubjects) return [];
    if (!searchQuery) return initialSubjects;

    return initialSubjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialSubjects, searchQuery]);

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

  const handleReset = () => {
    setInputValue("");
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-7 md:flex-row md:justify-between md:items-center">
        <BreadcrumbWithDropdown sem={sem} />
        <div className="relative md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Subject by Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-10 pr-10 text-sm"
          />
          {inputValue && (
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
              onClick={handleReset}
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
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Library className="h-8 w-8 text-neutral-500" />
              <h3 className="text-lg font-medium">No Subjects Found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                No subjects match your search. Try a different query.
              </p>
              <Button variant="outline" onClick={handleReset}>
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
