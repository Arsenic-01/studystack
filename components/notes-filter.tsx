"use client";

import { NoteCard } from "@/components/note-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchYoutubeLinks } from "@/lib/actions/Youtube.actions";
import { Note } from "@/lib/appwrite_types";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ListFilter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import DeleteYoutubeLink from "./DeleteYoutubeLink";
import EditYoutubeLink from "./EditYoutubeLink";

const fileTypes = [
  "Notes",
  "PPTS",
  "Modal_Solutions",
  "MSBTE_QP",
  "Videos",
  "Animations",
  "Programs",
  "Other",
];

const NotesFilter = ({
  notes,
  subjectName,
  semester,
  subjectId,
  subjectUnits,
}: {
  notes: Note[];
  subjectName: string | undefined;
  semester: string;
  subjectUnits: string[];
  subjectId: string;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("All");
  const { user } = useAuthStore();

  const { data: youtubeLinks = [], isError } = useQuery({
    queryKey: ["youtubeLinks", subjectId], // Ensure re-fetch when subjectId changes
    queryFn: () => fetchYoutubeLinks({ subjectId }), // ✅ Correct: function reference
    staleTime: 0,
  });

  if (isError) {
    toast.error("Failed to fetch YouTube videos.");
  }

  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredNotes = notes.filter((note) => {
    const matchesFileType =
      selectedFilters.length === 0 ||
      selectedFilters.includes(note.type_of_file!);
    const matchesUnit =
      selectedUnit === "All" || note.unit.includes(selectedUnit);
    return matchesFileType && matchesUnit;
  });

  return (
    <div className="container mx-auto py-28 sm:py-32 xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-8">
        <Button variant="outline" className="w-fit" asChild>
          <Link href={`/semester/${semester}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {subjectName ? `Notes for ${subjectName}` : "Invalid Subject URL"}
        </h1>
      </div>

      {notes.length > 0 && (
        <div className="flex flex-col gap-5">
          {/* Filters */}
          <div className="flex items-center gap-2 md:gap-3">
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {subjectUnits.map((unit, index) => (
                  <SelectItem key={index} value={unit}>
                    <span className="md:hidden">
                      {unit.length > 10 ? `${unit.substring(0, 14)}...` : unit}
                    </span>
                    <span className="hidden md:inline-block">
                      {unit.length > 10 ? `${unit.substring(0, 25)}...` : unit}
                    </span>
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
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              Showing {filteredNotes.length} out of {notes.length} notes
            </p>
          </div>
        </div>
      )}

      {/* YouTube Videos */}
      {youtubeLinks && youtubeLinks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">YouTube Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeLinks.map((link, index) => {
              // Extract video ID from different YouTube URL formats
              const videoIdMatch = link.url.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
              );
              const videoId = videoIdMatch ? videoIdMatch[1] : null;

              return videoId ? (
                <div key={index}>
                  <div className="w-full aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {user?.name === youtubeLinks[index].createdBy && (
                    <div className="flex gap-2 items-center justify-between">
                      <EditYoutubeLink
                        url={youtubeLinks[index].url}
                        id={youtubeLinks[index].id}
                      />
                      <DeleteYoutubeLink id={youtubeLinks[index].id} />
                    </div>
                  )}
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg mt-2 text-center">
                    Added by {youtubeLinks[index].createdBy}
                  </div>
                </div>
              ) : null; // Skip invalid URLs
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesFilter;
