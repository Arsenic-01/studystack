"use client";
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
import { Form, Note, Subject, Youtube } from "@/lib/appwrite_types";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowLeft,
  FileQuestion,
  Home,
  ListFilter,
  ListFilterPlus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/search-dialog";
import { GoogleFormCard } from "./google_form_components/GoogleFormCard";
import NoteCard from "./notes_helper_components/NoteCard";
import { YouTubeCard } from "./youtube_components/YouTubeCard";
import { Input } from "../ui/input";

interface NotesFilterProps {
  subject: Subject;
  initialNotes: Note[];
  initialYoutubeLinks: Youtube[];
  initialGoogleFormLinks: Form[];
}

const fileTypes = [
  "Notes",
  "PPTS",
  "Modal_Solutions",
  "MSBTE_QP",
  "Videos",
  "Assignments",
  "SLA",
  "Lab_Manuals",
  "Syllabus",
  "Animations",
  "Programs",
  "Other",
];
const NotesFilter = ({
  subject,
  initialNotes,
  initialYoutubeLinks,
  initialGoogleFormLinks,
}: NotesFilterProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const { user } = useAuthStore();

  // Fetch YouTube links and Google Forms for the subject
  const notes = initialNotes;
  const youtubeLinks = initialYoutubeLinks;

  const toggleFilter = (type: string) => {
    setSelectedFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  const toggleUserFilter = (userName: string) => {
    setSelectedUser((prev) =>
      prev.includes(userName)
        ? prev.filter((u) => u !== userName)
        : [...prev, userName]
    );
  };
  const filteredNotes = notes.filter((note) => {
    const matchesFileType =
      selectedFilters.length === 0 ||
      selectedFilters.includes(note.type_of_file!);
    const matchesUnit =
      selectedUnit === "All" || note.unit.includes(selectedUnit);
    const matchesUser =
      selectedUser.length === 0 || selectedUser.includes(note.users.name);
    return matchesFileType && matchesUnit && matchesUser;
  });
  const uniqueUsers = Array.from(new Set(notes.map((note) => note.users.name)));
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const [formSearchQuery, setFormSearchQuery] = useState("");
  const [selectedFormType, setSelectedFormType] = useState("all");

  const filteredForms = initialGoogleFormLinks.filter((form) => {
    const matchesType =
      selectedFormType === "all" || form.formType === selectedFormType;
    const matchesSearch =
      formSearchQuery === "" ||
      form.quizName.toLowerCase().includes(formSearchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const elementId = hash.substring(1); // remove the '#'
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 100); // 100ms delay is usually enough

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // The empty array [] ensures this runs only once when the component mounts

  return (
    <div className="container mx-auto py-28 sm:py-32 2xl:py-36 max-w-5xl px-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-8">
        <Button
          variant="outline"
          className={`${!subject.semester && "hidden"} w-fit`}
          asChild
        >
          <Link href={`/semester/${subject.semester}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <Button
          variant="outline"
          className={`${subject.semester && "hidden"} w-fit`}
          asChild
        >
          <Link href="/home">
            <Home /> Home
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {subject.name ? `Notes for ${subject.name}` : "Invalid Subject URL"}
        </h1>
      </div>
      {notes.length === 0 && (
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-10 py-20 text-center my-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
              <FileQuestion className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              No notes are available for this subject at the moment. They might
              be uploaded soon—stay tuned!
            </p>
          </div>
        </div>
      )}
      {notes.length > 0 && (
        <div className="flex flex-col gap-5">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex sm:flex-row items-center gap-2 md:gap-3 w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-fit">
                    <ListFilter />
                    <span className="hidden sm:block">
                      Filter by File type ({selectedFilters.length || "All"})
                    </span>
                    <span className="block sm:hidden">
                      File Type ({selectedFilters.length || "All"})
                    </span>
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
              {/* User Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-fit">
                    <ListFilterPlus />
                    <span className="hidden sm:block">
                      Filter by Faculty ({selectedUser.length || "All"})
                    </span>
                    <span className="block sm:hidden">
                      Faculty ({selectedUser.length || "All"})
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedUser([])}
                    >
                      <Checkbox checked={selectedUser.length === 0} />
                      <span className="text-sm">All</span>
                    </div>
                    {uniqueUsers.map((userName) => (
                      <div
                        key={userName}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleUserFilter(userName)}
                      >
                        <Checkbox checked={selectedUser.includes(userName)} />
                        <span className="text-sm capitalize">{userName}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* Unit Filter */}
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {subject.unit.map((unit, index) => (
                  <SelectItem key={index} value={unit}>
                    <span className="flex justify-start items-start w-[290px] sm:w-auto truncate">
                      {unit}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Notes Grid with Fallback UI */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div key={note.noteId} id={`note-${note.noteId}`}>
                  <NoteCard note={note} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center mb-8 md:my-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-3">
                  <FileQuestion className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  No notes match your current filter settings. Try adjusting
                  your filters or select All to see all available notes.
                </p>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFilters([]);
                      setSelectedUnit("All");
                      setSelectedUser([]);
                    }}
                  >
                    Reset all filters
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Notes Count */}
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
              Showing {filteredNotes.length} out of {notes.length} notes
            </p>
          </div>
        </div>
      )}

      {youtubeLinks && youtubeLinks.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Related Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeLinks.map((link) => {
              const videoIdMatch = link.youtubeLink.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
              );
              const videoId = videoIdMatch ? videoIdMatch[1] : null;

              if (!videoId) return null;

              return (
                <div key={link.id} id={`youtube-${link.id}`}>
                  <YouTubeCard
                    link={link}
                    videoId={videoId}
                    user={user}
                    onPlay={setPlayingVideoId}
                    semester={subject.semester}
                    abbreviation={subject.abbreviation}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog
        open={!!playingVideoId}
        onOpenChange={() => setPlayingVideoId(null)}
      >
        <DialogContent className="max-w-3xl p-0 border-0">
          <DialogTitle></DialogTitle>
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${playingVideoId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      {initialGoogleFormLinks && initialGoogleFormLinks.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Quizzes & Links
            </h2>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  className="pl-9 w-full sm:w-64"
                  value={formSearchQuery}
                  onChange={(e) => setFormSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedFormType}
                onValueChange={setSelectedFormType}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="googleForm">Google Forms</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="other">Other Links</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredForms.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredForms.map((form) => (
                <GoogleFormCard
                  key={form.id}
                  form={form}
                  user={user}
                  semester={subject.semester}
                  abbreviation={subject.abbreviation}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-semibold">No Links Found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filter settings.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default NotesFilter;
