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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  subjectUnits,
}: {
  notes: Note[];
  subjectName: string | undefined;
  semester: string;
  subjectUnits: string[]; // Add subjectUnits as a prop
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("All"); // State for selected unit

  // Toggle selection in the file type filter
  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Filter notes based on selected file types and unit
  const filteredNotes = notes.filter((note) => {
    const matchesFileType =
      selectedFilters.length === 0 ||
      selectedFilters.includes(note.type_of_file!);
    const matchesUnit =
      selectedUnit === "All" || note.unit.includes(selectedUnit);
    return matchesFileType && matchesUnit;
  });

  return (
    <div className="container mx-auto py-24 sm:py-32 xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 mb-8">
        <Button variant="outline" className="w-fit" asChild>
          <Link href={`/semester/${semester}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tighter">
          {subjectName ? `Notes for ${subjectName}` : "Invalid Subject URL"}
        </h1>
      </div>

      {notes.length === 0 && <p>No notes found</p>}

      {notes.length > 0 && (
        <div className="flex flex-col gap-5">
          {/* File Type Filter */}
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

            {/* Unit Filter */}
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {subjectUnits.map((unit, index) => (
                  <SelectItem key={index} value={unit}>
                    {unit.length > 10 ? `${unit.substring(0, 30)}...` : unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note.noteId} note={note} />
            ))}
          </div>

          {/* Notes Count */}
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
