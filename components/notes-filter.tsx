"use client";

import { useState } from "react";
import { NoteCard } from "@/components/note-card";
import { ArrowLeft, ListFilter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Note } from "@/lib/appwrite_types";

const fileTypes = [
  "notes",
  "ppts",
  "pyqs",
  "modal_ans",
  "videos",
  "animation",
  "sample_code",
  "outputs",
  "other",
];

const NotesFilter = ({
  notes,
  subjectName,
  semester,
}: {
  notes: Note[];
  subjectName: string | undefined;
  semester: string;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Toggle selection in the filter
  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter notes based on selected file types
  const filteredNotes =
    selectedFilters.length === 0
      ? notes
      : notes.filter((note) => selectedFilters.includes(note.type_of_file!));

  console.log(notes);

  return (
    <div className="container mx-auto py-28 sm:py-32 xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 mb-8">
        <Button variant="outline" className="w-fit" asChild>
          <Link href={`/semester/${semester}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tighter">
          {subjectName ? `Notes for ${subjectName}` : "Invalid Subject URL"}
        </h1>
      </div>

      {notes.length === 0 && <p>No notes found</p>}

      {notes.length > 0 && (
        <div className="flex flex-col gap-5">
          {/* Multi-Select Filter */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <ListFilter />
                  Filter by file type ({selectedFilters.length || "All"})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setSelectedFilters([])}
                  >
                    <Checkbox checked={selectedFilters.length === 0} />
                    <span className="text-sm">All</span>
                  </div>
                  {fileTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleFilter(type)}
                    >
                      <Checkbox checked={selectedFilters.includes(type)} />
                      <span className="text-sm capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note.noteId} note={note} />
            ))}
          </div>
          {/* <div>{subjectUnits}</div> */}
          <div>
            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredNotes.length} out of {notes.length} notes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesFilter;
