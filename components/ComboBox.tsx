"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchSemesters,
  fetchSubjectsBySemester,
} from "@/lib/actions/Student.actions";

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedSemester, setSelectedSemester] = React.useState<number | null>(
    null
  );

  // Fetch semesters
  const {
    data: semesters,
    isLoading: isSemestersLoading,
    isError: isSemestersError,
  } = useQuery({
    queryKey: ["semesters"],
    queryFn: fetchSemesters,
  });

  // Fetch subjects for the selected semester
  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
  } = useQuery({
    queryKey: ["subjects", selectedSemester],
    queryFn: () => {
      if (selectedSemester) {
        return fetchSubjectsBySemester(selectedSemester);
      }
      return [];
    },
    enabled: !!selectedSemester, // Only fetch if a semester is selected
  });

  if (isSemestersLoading) {
    return <div>Loading semesters...</div>;
  }

  if (isSemestersError) {
    return <div>Error loading semesters. Please try again later.</div>;
  }

  return (
    <div>
      {/* Semester Selection Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedSemester
              ? `Semester ${selectedSemester}`
              : "Select semester..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search semester..." />
            <CommandList>
              <CommandEmpty>No semester found.</CommandEmpty>
              <CommandGroup>
                {semesters?.map((semester) => (
                  <CommandItem
                    key={semester.value}
                    value={semester.value}
                    onSelect={(currentValue) => {
                      setSelectedSemester(Number(currentValue));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSemester === Number(semester.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {semester.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display Subjects for Selected Semester */}
      {selectedSemester && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Subjects for Semester {selectedSemester}
          </h2>
          {isSubjectsLoading ? (
            <div>Loading subjects...</div>
          ) : isSubjectsError ? (
            <div>Error loading subjects. Please try again later.</div>
          ) : (
            <ul className="space-y-2">
              {subjects?.map((subject) => (
                <li key={subject.subjectId} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.courseId}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
