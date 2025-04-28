"use client";

import { fetchSubjectsBySemester } from "@/lib/actions/Student.actions";
import { useQuery } from "@tanstack/react-query";
import { Library, Search, X } from "lucide-react";
import { useState } from "react";
import BreadcrumbWithDropdown from "./BreadCrumb";
import SubjectCard from "./SubjectCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SubjectCardSkeleton from "./SubjectCardSkeleton";

interface Props {
  sem: string;
}

const SubjectSearch = ({ sem }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: subjects = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["subjects", sem],
    queryFn: () => fetchSubjectsBySemester(Number(sem)),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 2, // retry twice on failure
  });

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="w-full pl-10 pr-10"
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
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <SubjectCardSkeleton key={index} />
            ))}
          </>
        ) : isError ? (
          <div className="text-center py-10 text-red-500">
            Failed to load subjects.
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <SubjectCard key={subject.subjectId} subject={subject} />
          ))
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
                <Library className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium">No Subjects Found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                No subjects found for the search query. Try a different search
                query or reset the search filters.
              </p>
              <div className="flex gap-3 mt-2">
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Reset search filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSearch;
